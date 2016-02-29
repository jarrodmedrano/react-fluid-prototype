import React from 'react'
import SubLinkBand from 'src/js/components/SubLinkBand/SubLinkBand.jsx!';
import { Router, Route, RouteHandler, Link, IndexRoute } from 'react-router';
import PerformancePage from 'src/js/components/pages/SurfacePage/PerformancePage.jsx!';

import _ from 'lodash';

var SurfacePage = React.createClass({

    render() {
        let slideBG = {
            background: "url(img/Device_Landing.png)",
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat'
        };

        return (
            <div style={slideBG} className="bg-page">
                {this.props.children}
            </div>
        );
    }
});

export default SurfacePage
