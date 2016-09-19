import React from 'react'
import './tabs.scss'

import { Router, Route, Link, IndexLink, IndexRoute } from 'react-router';

class Tabs extends React.Component {

    render() {

        const depth = this.props.routes.length;

        console.log(depth);

        const rootRoute = this.props.routes[0];

        const rootRouteChildren = rootRoute.childRoutes;

        const innerRoute = this.props.routes[1];

        const innerRouteChildren = innerRoute.childRoutes;

        return (
            <div className="tabs">
                <ul>
                    <li className="c-hyperlink">
                    </li>
                </ul>
            </div>
        )
    }
}

export default Tabs