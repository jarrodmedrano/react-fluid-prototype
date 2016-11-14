import 'systemjs-hot-reloader/default-listener.js';
import React from 'react'
import ReactDOM from 'react-dom'
import {Router, Route, IndexRoute, useRouterHistory} from 'react-router'
import TransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import {createHashHistory} from 'history';
const appHistory = useRouterHistory(createHashHistory)({queryKey: false});
//Components
import MasterLayout from './layouts/MasterLayout';

var myData = window.datasource;

var Index = myData.groups[0];

var Routes = myData.groups.filter(function (result, index) {
    if (index > 0) {
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
                            data: myData,
                        })}
                    </TransitionGroup>
                </div>
            );
    }
}

console.log('test');


class RenderForcer extends React.Component {
    componentWillMount () {
        this.forceUpdate()  // a little hack to help us rerender when this module is reloaded
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
    children: React.PropTypes.node,
};
