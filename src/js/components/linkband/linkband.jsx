import React from 'react'
import ReactWinJS from 'react-winjs';
import 'src/js/components/linkband/LinkBand.scss!';
import SubLinkBand from 'src/js/components/SubLinkBand/SubLinkBand.jsx!';
import { Router, Route, Link, IndexLink, IndexRoute } from 'react-router';

import _ from 'lodash';

var Linkband = React.createClass({

    contextTypes: {
        location: React.PropTypes.object
    },

    render() {

        const depth = this.props.routes.length;

        const rootRoute = this.props.routes[0];

        const rootRouteChildren = rootRoute.childRoutes;

        const innerRoute = this.props.routes[1];

        const innerRouteChildren = innerRoute.childRoutes;


        return (
            <div className="win-type-body">
                <div className="win-linkband">
                   <ul>
                       <li><IndexLink to={rootRoute.path} activeClassName="active">{rootRoute.indexRoute.title}</IndexLink><span
                           className="ghost">
                               {rootRoute.indexRoute.title}
                           </span></li>
                       {rootRouteChildren.map((item, index) =>
                       <li key={index}>
                           <Link
                               activeClassName="active"
                               to={item.path || ''}>
                               {item.title}
                           </Link>
                           <span
                               className="ghost">
                               {item.title}
                           </span>
                           {(index + 1) < depth}
                       </li>
                       )}
                   </ul>
                </div>
                {innerRouteChildren != null ? <div className="win-linkband sub-linkband">
                    <ul>
                        <li><IndexLink to={innerRoute.path} activeClassName="active">{innerRoute.indexRoute.title}</IndexLink><span className="ghost">
                               {innerRoute.indexRoute.title}
                           </span></li>
                        {innerRouteChildren.map((item, index) =>
                        <li key={index}>
                            <Link
                                activeClassName="active"
                                to={item.path || ''}>
                                {item.title}
                            </Link>
                           <span
                               className="ghost">
                               {item.title}
                           </span>
                            {(index + 1) < depth}
                        </li>
                            )}
                    </ul>
                </div> : null}
            </div>

        );
    }
});

export default Linkband
