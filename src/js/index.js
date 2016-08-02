import React from 'react'
import ReactDOM from 'react-dom'
import WinJS from 'winjs'
import {Router, DefaultRoute, Route, Link, IndexRoute, hashHistory, useRouterHistory} from 'react-router'
import TransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import {createHashHistory} from 'history';
const appHistory = useRouterHistory(createHashHistory)({queryKey: false});

//Components
import Linkband from 'src/js/components/linkband/linkband';
import DefaultPage from 'src/js/components/pages/DefaultPage';

//Styles
import 'src/styles/main.scss!';
import 'src/styles/mwf_en-us_default.min.css!';


var data = fetchData('data/data.json').done(function (xhr) {

    data = xhr.response;

    var Index = data.routes.reduce(function (result) {
        if (result.type !== 'IndexRoute') {
            return false
        }
        return result;
    });

    var Routes = data.routes.filter(function (result) {
        if (result.type === 'IndexRoute') {
            return false
        }
        return true;
    }).map(function (result) {
        return result
    });

    ReactDOM.render(
        <Router history={appHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={DefaultPage} title={Index.title}/>
                {Routes.map(function (result, id) {
                    return <Route component={DefaultPage} key={id} path={result.path} title={result.title}/>;
                })}
            </Route>
        </Router>
        , document.getElementById('app')
    );
});

function fetchData(request) {
    return WinJS.xhr({url: request, responseType: "json"})
}


class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data: {}
        }
    }

    componentDidMount() {
        var that = this;

        that.setState({
            data: data
        });
    }

    render() {

        if (this.state.data === {}) {

            return (
                <div className="grid">Loading...</div>
            )

        } else {
            console.log(this.state.data);

            return (
                <div className="grid">
                    <Linkband routes={this.props.routes} params={this.props.params}/>
                    <TransitionGroup component="div" transitionName="page-transition"
                                     transitionEnterTimeout={500} transitionLeaveTimeout={500}>
                        {React.cloneElement(this.props.children, {
                            key: this.props.location.pathname,
                            data: data
                        })}
                    </TransitionGroup>
                </div>
            );
        }
    }
}

