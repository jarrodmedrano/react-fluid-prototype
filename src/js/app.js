import React from 'react'
import ReactDOM from 'react-dom'
import {Router, Route, IndexRoute, useRouterHistory} from 'react-router'
import TransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import {createHashHistory} from 'history';
const appHistory = useRouterHistory(createHashHistory)({queryKey: false});
import MasterLayout from './layouts/MasterLayout';
import Scroll from 'react-scroll';
import data from '../data/assembleData';

if (typeof window !== 'undefined') {
    window.React = React;
}

if (window.RDX) {
    window.datasource = JSON.parse(window.RDX.datasource);
}
else {
    window.datasource = data;
    console.log(data);
}

const myData = window.datasource;
const Index = myData.groups[0];
const Routes = myData.groups.filter(function (result, index) {
    if (index > 0) {
        return result;
    }
});

class App extends React.Component {
    render() {
            return (
                <div>
                    <TransitionGroup component="div" transitionName="page-transition"
                                     transitionEnterTimeout={300} transitionLeaveTimeout={300}>
                        {React.cloneElement(this.props.children, {
                            key: this.props.location.pathname,
                            data: myData,
                        })}
                    </TransitionGroup>
                </div>
            );
    }
}

class RenderForcer extends React.Component {
    componentWillMount () {
        this.forceUpdate();
    }
    render () {
        return (
            <Router history={appHistory}>
                <Route path="/" component={App}>
                    <IndexRoute title={Index.groupIdentifier}
                                component={(props, state, params) => <MasterLayout  {...props} />}/>
                    {Routes.map(function (result, id) {
                        return <Route key={id} path={result.groupIdentifier} title={result.groupIdentifier}
                                      component={(props, state, params) => <MasterLayout  {...props} />}/>;
                    })}
                </Route>
            </Router>
        )
    }
}

ReactDOM.render(
    <RenderForcer />
    , document.getElementById('app')
);

App.propTypes = {
    children: React.PropTypes.node
};
