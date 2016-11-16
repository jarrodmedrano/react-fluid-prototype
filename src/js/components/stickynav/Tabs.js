import React from 'react';
import './tabs.scss!'

import { Link, IndexLink } from 'react-router';

class Tabs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        let logoTabs = this.props.data.groups.reduce(function(newVal, previousVal, key) {
            if(previousVal.brand.logoTab != null) {
                newVal[key] = previousVal.brand.logoTab;
            }
            return newVal;
        }, {});

        let logoColors = this.props.data.groups.reduce(function(newVal, previousVal, key) {
            if(previousVal.brand.tabColor != null) {
                newVal[key] = previousVal.brand.tabColor;
            }
            return newVal
        }, {});

        this.state = Object.assign(this.state, {logoTabs}, {logoColors});
    }

    render() {
        const depth = this.props.routes.length;
        const rootRoute = this.props.routes[0];
        const rootRouteChildren = rootRoute.childRoutes;
        return (
            <div className="tabs">
                <ul>
                    <li className="c-hyperlink"><IndexLink to={rootRoute.path} activeClassName="active" activeStyle={{ background: this.state.logoColors[0] }}>{this.state.logoTabs[0] ? <img src={ this.state.logoTabs[0]} alt={rootRoute.title}  /> : rootRoute.title}</IndexLink></li>
                    {rootRouteChildren !=null ? rootRouteChildren.map((item, index) =>
                        <li className="c-hyperlink" key={index}>
                            <Link
                                activeClassName="active"
                                activeStyle={{ background: this.state.logoColors[index + 1] }}
                                to={item.path || ''}>
                                {this.state.logoTabs[index + 1] ? <img src={this.state.logoTabs[index + 1]} alt={item.title} /> : item.title}
                            </Link>
                            {(index + 1) < depth}
                        </li>
                    ) : null}
                </ul>
            </div>
        )
    }
}

export default Tabs
