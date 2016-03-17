import React from 'react'

import 'src/js/components/linkband/LinkBand.scss!';
import { Router, Route, Link, IndexLink, IndexRoute } from 'react-router';

class Linkband extends React.Component {

    render() {

        const depth = this.props.routes.length;

        const rootRoute = this.props.routes[0];

        const rootRouteChildren = rootRoute.childRoutes;

        const innerRoute = this.props.routes[1];

        const innerRouteChildren = innerRoute.childRoutes;


        return (
            <div className={innerRouteChildren != null ? 'sub-route': ''}>
                <nav className="c-link-navigation">
                   <ul>
                       <li className="c-hyperlink"><IndexLink to={rootRoute.path} activeClassName="active">{rootRoute.indexRoute.title}</IndexLink><span
                           className="ghost">
                               {rootRoute.indexRoute.title}
                           </span></li>
                       {rootRouteChildren.map((item, index) =>
                       <li className="c-hyperlink" key={index}>
                           <Link
                               activeClassName="active"
                               to={item.path || ''}>
                               {item.title}
                           </Link>
                           <span className="ghost">{item.title}</span>
                           {(index + 1) < depth}
                       </li>
                       )}
                   </ul>
                </nav>
            </div>

        );
    }
}

export default Linkband
