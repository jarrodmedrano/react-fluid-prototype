import React from 'react';
import './tabs.scss!'
import dataPropTypes, {verticalPagePropTypes} from '../../../data/dataProps';
import { Link, IndexLink } from 'react-router';
import propsAreValid, {navigateEvent} from '../../lib/util';
import _ from 'lodash';

class Tabs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: false
        };

        let logos = this.props.data.groups.reduce(function(newVal, previousVal, key) {
            if(previousVal.brand.logoTab != null) {
                newVal[key] = previousVal.brand.logoTab;
            }
            return newVal;
        }, {});

        let selectedLogos = this.props.data.groups.reduce(function(newVal, previousVal, key) {
            if(previousVal.brand.selectedLogoTab != null) {
                newVal[key] = previousVal.brand.selectedLogoTab;
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

        this.state = Object.assign(this.state, {logos}, {selectedLogos}, {logoColors});
    }

    _handleClick(group, index) {
        console.log(this);
        let sectionId = _.find(this.props.data.groups[index].sections, 'sectionIdentifier');
        navigateEvent(group, sectionId.sectionIdentifier, 'tab click');
    }

    render() {
        if (propsAreValid(this.props.routes, this)) {
            const depth = this.props.routes.length;
            const rootRoute = this.props.routes[0];
            const rootRouteChildren = rootRoute.childRoutes;
            const indexTitle = rootRoute.indexRoute.title;

            return (
                <div className="tabs">
                    <ul>
                        <li className="c-hyperlink">
                            <IndexLink to={rootRoute.path}
                               onClick={() => this._handleClick(indexTitle, 0)}
                               activeClassName="active"
                               activeStyle={{background: this.state.logoColors[0]}}
                            >
                                {this.state.logos[0] ? <img src={this.state.logos[0]} alt={indexTitle} /> : <p>{indexTitle}</p>}

                                {this.state.selectedLogos[0] ?
                                    <img src={this.state.selectedLogos[0]} alt={indexTitle} className="selected" /> :
                                    this.state.logos[0] ? <img src={this.state.logos[0]} alt={indexTitle} className="selected"/> :
                                    <p className="selected">{indexTitle}</p>
                                }
                            </IndexLink>
                        </li>
                        {rootRouteChildren != null ? rootRouteChildren.map((item, index) =>
                                <li className="c-hyperlink" key={index}>
                                    <Link
                                        activeClassName="active"
                                        activeStyle={{background: this.state.logoColors[index + 1]}}
                                        to={item.path || ''} onClick={() => this._handleClick(item.title || '', index + 1)}>

                                        {this.state.logos[index + 1] ?
                                            <img src={this.state.logos[index + 1]} alt={item.title}/> :
                                            <p>{item.title}</p>
                                        }

                                        {this.state.selectedLogos[index + 1] ?
                                            <img src={this.state.selectedLogos[index + 1]} alt={item.title} className="selected" /> :
                                                this.state.logos[index + 1] ?
                                            <img src={this.state.logos[index + 1]} alt={item.title} className="selected" /> :
                                                <p className="selected">{item.title}</p>
                                        }
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
