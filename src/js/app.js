import React from 'react'
import ReactDOM from 'react-dom'
import WinJS from 'winjs'
import {Router, DefaultRoute, Route, Link, IndexRoute, browserHistory} from 'react-router'
import TransitionGroup from 'react/lib/ReactCSSTransitionGroup';

//Components
// import Linkband from './components/linkband/linkband';
/* TODO import only page components we need */
// import MosaicPage from './layouts/MosaicPage';
import VerticalPage from './layouts/VerticalPage';

document.addEventListener("DOMContentLoaded", function () {

    if(process.env.NODE_ENV === 'dev') {
        myData = require('../data/hubRoot.json');
    } else {
        myData = window.datasource;
    }

    var Index = myData.pages.reduce(function (result) {
        if (result.type !== 'IndexRoute') {
            return false
        }
        return result;
    });

    var Routes = myData.pages.filter(function (result) {
        if (result.type === 'IndexRoute') {
            return false
        }
        return true;
    }).map(function (result) {
        return result
    });

    ReactDOM.render(
        <Router history={browserHistory}>
            <Route path="/" component={App}>
                /* TODO get page component type from json */
                <IndexRoute component={VerticalPage} title={Index.title}/>
                {Routes.map(function (result, id) {
                    return <Route component={VerticalPage} key={id} path={result.path} title={result.title}/>;
                })}
            </Route>
        </Router>
        , document.getElementById('app')
    );
});

var myData = {};

class App extends React.Component {

    render() {
        return (
            <div>
                {/*<Linkband routes={this.props.routes} params={this.props.params}/>*/}
                <TransitionGroup component="div" transitionName="page-transition"
                                 transitionEnterTimeout={500} transitionLeaveTimeout={500}>
                    {React.cloneElement(this.props.children, {
                        key: this.props.location.pathname,
                        data: myData
                    })}
                </TransitionGroup>
            </div>
        );
    }
}