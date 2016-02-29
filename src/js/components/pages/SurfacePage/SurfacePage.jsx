import React from 'react'
import SubLinkBand from 'src/js/components/SubLinkBand/SubLinkBand.jsx!';
import { Router, Route, RouteHandler, Link, IndexRoute } from 'react-router';
import PerformancePage from 'src/js/components/pages/SurfacePage/PerformancePage.jsx!';
import Hero from 'src/js/components/hero/hero.jsx!';
import _ from 'lodash';

var SurfacePage = React.createClass({

    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
});

export default SurfacePage
