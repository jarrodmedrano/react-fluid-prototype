import React from 'react'
import ReactDOM from 'react-dom'
import {Router, Route, Redirect, IndexRedirect, useRouterHistory} from 'react-router'
import {createHashHistory} from 'history';
const appHistory = useRouterHistory(createHashHistory)({queryKey: false});
import MasterLayout from './components/structure/MasterLayout';
//TODO: replace this library with regular event listeners.
import keydown from 'react-keydown';
import PropTypes from 'prop-types';
import Scroll  from 'react-scroll';
import Tabs from './components/structure/header/tabs/Tabs';

const scroller = Scroll.scroller;
//import fonts
import '../styles/fonts.scss!';
import '../styles/main.scss!';

import {myData, Index, Routes} from './datasource';
//For React Dev Tools in browser
if (typeof window !== 'undefined') {
    window.React = React;
}

//Navigate to Home
window.home = () => {
    appHistory.push('/');
};

//Reset function
window.reset = () => {
    let reset = new Promise(function(resolve){
        appHistory.push('/');
        ReactDOM.unmountComponentAtNode(document.getElementById('app'), resolve)
    });
    reset.then(ReactDOM.render(<RenderForcer />, document.getElementById('app')));
};

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data: myData
        }
    }

    //Navigate to home page
    @keydown( 'cmd+h', 'ctrl+alt+h' )
    homeGroup(e) {
        e.preventDefault();
        window.home();
    }

    //Reset this page
    @keydown( 'cmd+option+h', 'ctrl+alt+r' )
    resetGroup(e) {
        e.preventDefault();
        window.reset();
    }

    render() {
        return (
            <div>
           {this.state.data.groups.length > 1 ? <Tabs data={this.state.data} {...this.props} /> : null }
            {React.cloneElement(this.props.children, {
                key: this.props.location.pathname,
                data: this.state.data
            })}
            </div>
        );
    }
}

class RenderForcer extends React.Component {

    componentDidMount() {
        appHistory.listen((location) => {
            if(location.hash) {
                scroller.scrollTo(location.hash.substr(1), {
                    duration: 0,
                    delay: 0,
                    smooth: true,
                    containerId: 'main',
                })
            }
        })
    }

    render() {
        return (
            <Router history={appHistory}>
                <Route path="/" component={App}>
                    {Routes.map(function (result, id) {
                        return <Route key={id} path={result.groupIdentifier} title={result.groupIdentifier}
                                      component={(props, state, params) => <MasterLayout {...props} />} />;
                    }, this)}
                    <IndexRedirect to={Index.groupIdentifier} />
                </Route>
               <Redirect from="*" to="#" />
            </Router>
        )
    }
}

ReactDOM.render(
    <RenderForcer />
    , document.getElementById('app')
);

App.propTypes = {
    children: PropTypes.node
};