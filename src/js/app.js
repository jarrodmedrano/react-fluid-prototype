import React from 'react'
import ReactDOM from 'react-dom'
import {Router, Route, IndexRoute, useRouterHistory} from 'react-router'
import TransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import { createHashHistory } from 'history';
const appHistory = useRouterHistory(createHashHistory)({ queryKey: false });
//Components
import VerticalPage from './layouts/VerticalPage';
import '../styles/mwf-west-european-default.min.css!'

var myData = window.datasource;

/* TODO make groups name independent */

var Index = myData.groups[0];

var Routes = myData.groups.filter(function(result, index) {
    if(index > 0) {
      return result;
    }
});

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

ReactDOM.render(
    <Router history={appHistory}>
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