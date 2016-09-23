import React from 'react'
import ReactDOM from 'react-dom'
import {Router, Route, IndexRoute, browserHistory} from 'react-router'
import TransitionGroup from 'react/lib/ReactCSSTransitionGroup';

//Components
import VerticalPage from './layouts/VerticalPage';

document.addEventListener('DOMContentLoaded', function () {

    if(process.env.NODE_ENV === 'dev') {
        myData = require('../data/hubRoot.json');
    } else {
        myData = window.datasource;
    }

    /* TODO make groups name independent */

    var Index = myData.groups[0];

    var Routes = myData.groups.filter(function(result, index) {
        if(index > 0) {
          return result;
        }
    });

    ReactDOM.render(
        <Router history={browserHistory}>
            <Route path="/" component={App}>
                /* TODO get page component type from json */
                <IndexRoute component={VerticalPage} title={Index.groupIdentifier}/>
                {Routes.map(function (result, id) {
                    return <Route component={VerticalPage} key={id} path={result.groupIdentifier} title={result.groupIdentifier}/>;
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