import React from 'react'
import ReactDOM from 'react-dom'
import { Router, DefaultRoute, Route, Link, IndexRoute, hashHistory, useRouterHistory} from 'react-router'
import TransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import { createHashHistory } from 'history';
const appHistory = useRouterHistory(createHashHistory)({ queryKey: false });

//Components
import Linkband from 'src/js/components/linkband/linkband';
import HomePage from 'src/js/components/pages/HomePage';
import SurfacePage from 'src/js/components/pages/SurfacePage/SurfacePage';
import WindowsPage from 'src/js/components/pages/WindowsPage/WindowsPage';
import StorePage from 'src/js/components/pages/StorePage';
import OfficePage from 'src/js/components/pages/OfficePage';

//Styles
import 'src/styles/main.scss!';
import 'src/styles/mwf_en-us_default.min.css!';



var App = React.createClass({


    render() {


        return (
            <div className="grid">
                <Linkband routes={this.props.routes} params={this.props.params}/>
                <TransitionGroup className="main-container" component="div" transitionName="page-transition"
                                 transitionEnterTimeout={500} transitionLeaveTimeout={500}>
                    {React.cloneElement(this.props.children, {
                        key: this.props.location.pathname
                        })}
                </TransitionGroup>
            </div>
        );
    }
});


ReactDOM.render(

        <Router history={appHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={HomePage} title="Welcome"/>
                <Route path="surface" component={SurfacePage} title="Surface" />
                <Route path="windows" component={WindowsPage} title="Windows" />
                <Route path="store" component={StorePage} title="Microsoft Store"/>
                <Route path="office" component={OfficePage} title="Office"/>
            </Route>
        </Router>
    , document.getElementById('app')
);
