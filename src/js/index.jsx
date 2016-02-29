import React from 'react'
//
import Linkband from 'src/js/components/linkband/linkband.jsx!';
import HomePage from 'src/js/components/pages/HomePage.jsx!';
import SurfacePage from 'src/js/components/pages/SurfacePage/SurfacePage.jsx!';
import PerformancePage from 'src/js/components/pages/SurfacePage/PerformancePage.jsx!';
import AccessoriesPage from 'src/js/components/pages/SurfacePage/AccessoriesPage.jsx!';
import RotatePage from 'src/js/components/pages/SurfacePage/RotatePage.jsx!';
import WindowsPage from 'src/js/components/pages/WindowsPage/WindowsPage.jsx!';
import StorePage from 'src/js/components/pages/StorePage.jsx!';
import OfficePage from 'src/js/components/pages/OfficePage.jsx!';
import SideBar from 'src/js/components/sidebar/SideBar.jsx!';
import { Router, DefaultRoute, Route, Link, IndexRoute, BrowserHistory } from 'react-router';
import 'src/styles/main.scss!';
import 'src/styles/mwf_en-us_default.min.css!';
import TransitionGroup from 'react/lib/ReactCSSTransitionGroup';


var App = React.createClass({

    componentWillMount() {
        window.addEventListener("resize", this.handleResize);
    },
    componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
    },

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

React.render((
    <Router history={BrowserHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={HomePage} title="Welcome"/>
            <Route path="surface" component={SurfacePage} title="Surface">
                <IndexRoute component={PerformancePage} title="Exceptional Performance"/>
                <Route path="/surface/rotate" component={RotatePage} title="Light and Powerful"/>
                <Route path="/surface/apps" component={AccessoriesPage} title="Limitless Apps"/>
                <Route path="/surface/accessories" component={AccessoriesPage} title="Accessories"/>
                <Route path="/surface/tech-specs" component={AccessoriesPage} title="Tech Specs"/>
            </Route>
            <Route path="windows" component={WindowsPage} title="Windows">
                <IndexRoute component={WindowsPage} title="Achieve More"/>
                <Route path="/windows/productivity" component={RotatePage} title="Ultimate Productivity"/>
                <Route path="/windows/universal-store" component={AccessoriesPage} title="Universal Store"/>
                <Route path="/windows/cortana" component={AccessoriesPage} title="Cortana and Windows"/>
                <Route path="/windows/interactive-guides" component={AccessoriesPage} title="Interactive Guides"/>
            </Route>
            <Route path="store" component={StorePage} title="Microsoft Store"/>
            <Route path="office" component={OfficePage} title="Office"/>
        </Route>
    </Router>
), document.getElementById('app'))
