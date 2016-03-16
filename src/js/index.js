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
import DefaultPage from 'src/js/components/pages/DefaultPage';


//Styles
import 'src/styles/main.scss!';
import 'src/styles/mwf_en-us_default.min.css!';

import data from 'src/js/data/data.json!';


var App = React.createClass({

    render() {

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
});


ReactDOM.render(

        <Router history={appHistory}>
            <Route path="/" component={App}>
                {data.routes.filter(function(result, id) {
                    if(result.type !== 'IndexRoute') {
                        return false
                    }
                    return true;
                }).map(function(result, id) {
                    return <IndexRoute component={DefaultPage} key={id} title={result.title}/>;
                })}
                {data.routes.filter(function(result, id) {
                    if(result.type === 'IndexRoute') {
                        return false
                    }
                    return true;
                }).map(function(result, id) {
                    return <Route component={DefaultPage} key={id} path={result.path} title={result.title}/>;
                })}
            </Route>
        </Router>
    , document.getElementById('app')
);
