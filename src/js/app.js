import React from 'react'
import ReactDOM from 'react-dom'
import {Router, Route, IndexRoute, useRouterHistory} from 'react-router'
import TransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import {createHashHistory} from 'history';
const appHistory = useRouterHistory(createHashHistory)({queryKey: false});
import Scroll  from 'react-scroll';
const scroll = Scroll.animateScroll;
import MasterLayout from './layouts/MasterLayout';
import data from '../data/assembleData';
//TODO: replace this library with regular event listeners.
import keydown from 'react-keydown';

//import fonts
import '../styles/fonts.scss!';
//For React Dev Tools in browser
if (typeof window !== 'undefined') {
    window.React = React;
}

//Check if Window.RDX exists, if not, load data from dummyData
window.RDX ? window.datasource = JSON.parse(window.RDX.datasource) : window.datasource = data;
const myData = window.datasource;
const Index = myData.groups[0];
const Routes = myData.groups.filter(function (result, index) {
    if (index > 0) {
        return result;
    }
});

//Navigate to Home
window.home = () => appHistory.push('/');

//Reset function
window.reset = () => {
    let reset = new Promise(function(resolve){
        appHistory.replace('/');
        ReactDOM.unmountComponentAtNode(document.getElementById('app'), resolve)
    });
    reset.then(ReactDOM.render(<RenderForcer />, document.getElementById('app')));
};

class App extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillUpdate() {
        scroll.scrollTo(0, {delay: 0, duration: 0});
    }

    @keydown( 'cmd+h', 'ctrl+alt+h' )
    homeGroup(e) {
        e.preventDefault();
        window.home();
    }

    @keydown( 'cmd+option+h', 'ctrl+alt+r' )
    resetGroup(e) {
        e.preventDefault();
        window.reset();
    }

    render() {
        return (
            <div>
                    {React.cloneElement(this.props.children, {
                        key: this.props.location.pathname,
                        data: myData
                    })}
            </div>
        );
    }
}

class RenderForcer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            updatedId: Math.random()
        };

        this._changeHandler = this._changeHandler.bind(this);
    }

    componentWillMount() {
        this.forceUpdate();
    }

    _changeHandler() {
        this.setState({updatedId: Math.random()});
    }

    render() {
        return (
            <Router history={appHistory}>
                <Route path="/" component={App} onChange={this._handleChange}>
                    <IndexRoute onChange={this._changeHandler} title={Index.groupIdentifier}
                                component={(props, state, params) => <MasterLayout {...props} updatedId={this.state.updatedId} />}/>
                    {Routes.map(function (result, id) {
                        return <Route onChange={this._changeHandler} key={id} path={result.groupIdentifier} title={result.groupIdentifier}
                                      component={(props, state, params) => <MasterLayout  {...props} updatedId={this.state.updatedId} />} />;
                    }, this)}
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