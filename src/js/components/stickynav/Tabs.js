import React from 'react'
import './tabs.scss'
import _ from 'lodash'
import classNames from 'classnames'

import { Router, Route, Link, IndexLink, IndexRoute } from 'react-router';



class Tabs extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

        };

        var logoTabs = this.props.groups.map(function(result) {

            return result.brand

        }).reduce(function(newVal, previousVal, key) {

            previousVal.logoTab = require(`img/${previousVal.logoTab}`);

            newVal[key] = previousVal;

            return newVal;

        }, {});

        this.state = Object.assign(this.state, {logoTabs});

        console.log(this.state);

    }

    render() {

        const depth = this.props.routes.length;

        const rootRoute = this.props.routes[0];

        const rootRouteChildren = rootRoute.childRoutes;

        const innerRoute = this.props.routes[1];

        const innerRouteChildren = innerRoute.childRoutes;

        return (
            <div className="tabs">
                <ul>
                    <li className="c-hyperlink"><IndexLink to={rootRoute.path} activeClassName="active"><img alt={rootRoute.title}  /></IndexLink></li>
                    {rootRouteChildren !=null ? rootRouteChildren.map((item, index) =>
                        <li className="c-hyperlink" key={index}>
                            <Link
                                activeClassName="active"
                                activeStyle={{ background: 'red' }}
                                to={item.path || ''}>
                                <img  alt={item.title} />
                            </Link>
                            {(index + 1) < depth}
                        </li>
                    ) : ''}
                </ul>
            </div>
        )
    }
}

export default Tabs