import React from 'react'
import './tabs.scss'

import { Router, Route, Link, IndexLink, IndexRoute } from 'react-router';



class Tabs extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

        };

        // brandLogo: require(`img/${this.props.groups[0]}`)

        var logoTabs = this.props.groups.map(function(result) {

           return result.brand[0].logoTab

        }).reduce(function(result, item, i) {

            result['logoTab' + i] = item;
            return result;

        }, {});

        this.state = Object.assign(this.state, logoTabs);

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
                    <li className="c-hyperlink"><IndexLink to={rootRoute.path} activeClassName="active"><img alt={rootRoute.title} src="" /></IndexLink></li>
                    {rootRouteChildren !=null ? rootRouteChildren.map((item, index) =>
                        <li className="c-hyperlink" key={index}>
                            <Link
                                activeClassName="active"
                                to={item.path || ''}>
                                <img src="" alt={item.title} />
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