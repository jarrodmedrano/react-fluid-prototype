import React from 'react';
import './tabs.scss!'
import dataPropTypes, {verticalPagePropTypes} from '../../../data/dataProps';
import { Link, IndexLink } from 'react-router';
import propsAreValid, {navigateEvent} from '../../lib/util';

class Tabs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        let logos = this.props.data.groups.reduce(function(newVal, previousVal, key) {
            if(previousVal.brand.logo != null) {
                newVal[key] = previousVal.brand.logo;
            }
            return newVal;
        }, {});

        let logoColors = this.props.data.groups.reduce(function(newVal, previousVal, key) {
            if(previousVal.brand.color != null) {
                newVal[key] = previousVal.brand.color;
            } else {
                newVal[key] = '#0078D7';
            }
            return newVal
        }, {});

        this.state = Object.assign(this.state, {logos}, {logoColors});
    }

    _handleClick(e) {
        navigateEvent(e);
    }

    render() {
        if (propsAreValid(this.props.routes)) {
            const depth = this.props.routes.length;
            const rootRoute = this.props.routes[0];
            const rootRouteChildren = rootRoute.childRoutes;
            const indexTitle = rootRoute.indexRoute.title;

            return (
                <div className="tabs">
                    <ul>
                        <li className="c-hyperlink">
                            <IndexLink to={rootRoute.path} onClick={() => this._handleClick(indexTitle)} activeClassName="active" activeStyle={{background: this.state.logoColors[0]}}>
                                {this.state.logos[0] ? <img src={this.state.logos[0]} alt={indexTitle}/> : indexTitle}
                            </IndexLink>
                        </li>
                        {rootRouteChildren != null ? rootRouteChildren.map((item, index) =>
                                <li className="c-hyperlink" key={index}>
                                    <Link
                                        activeClassName="active"
                                        activeStyle={{background: this.state.logoColors[index + 1]}}
                                        to={item.path || ''} onClick={() => this._handleClick(item.title || '')}>
                                        {this.state.logos[index + 1] ?
                                            <img src={this.state.logos[index + 1]} alt={item.title}/> :
                                            <p>{item.title}</p>}
                                    </Link>
                                    {(index + 1) < depth}
                                </li>
                            ) : null}
                    </ul>
                </div>
            )
        }
    }
}

Tabs.propTypes = dataPropTypes(verticalPagePropTypes);

export default Tabs
