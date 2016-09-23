import React from 'react'
import './tabs.scss'

import { Link, IndexLink } from 'react-router';

class Tabs extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

        };

        var logoTabs = this.props.groups.reduce(function(newVal, previousVal, key) {

            newVal[key] = require(`img/${previousVal.brand.logoTab}`);

            return newVal;

        }, {});

        var logoColors = this.props.groups.reduce(function(newVal, previousVal, key) {

            newVal[key] = previousVal.brand.color;
            return newVal

        }, {});

        this.state = Object.assign(this.state, {logoTabs}, {logoColors});
        console.log(this.state);
    }

    render() {

        const depth = this.props.routes.length;

        const rootRoute = this.props.routes[0];

        const rootRouteChildren = rootRoute.childRoutes;

        return (
            <div className="tabs">
                <ul>
                    <li className="c-hyperlink"><IndexLink to={rootRoute.path} activeClassName="active"><img src={this.state.logoTabs[0]} alt={rootRoute.title}  /></IndexLink></li>
                    {rootRouteChildren !=null ? rootRouteChildren.map((item, index) =>
                        <li className="c-hyperlink" key={index}>
                            <Link
                                activeClassName="active"
                                activeStyle={{ background: this.state.logoColors[index + 1] }}
                                to={item.path || ''}>
                                <img src={this.state.logoTabs[index + 1]} alt={item.title} />
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