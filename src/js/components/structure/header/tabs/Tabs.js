import React from 'react';
import dataPropTypes, {verticalPagePropTypes} from '../../../../../data/dataProps';
import { Link } from 'react-router';
import propsAreValid, {navigateEvent} from '../../../../lib/util';

class Tabs extends React.Component {
    constructor(props) {
        super(props);

        const rootRoute = Object.assign({}, props.routes[0]);
        const rootRouteChildren = rootRoute.childRoutes;


        this.state = {
            selected: false,
            rootRoute: rootRoute,
            rootRouteChildren: rootRouteChildren,
        };

        const logos = this.props.data.groups.reduce(function(newVal, previousVal, key) {
            if(previousVal.brand.logoTab !== null) {
                newVal[key] = previousVal.brand.logoTab;
            }
            return newVal;
        }, {});

        const selectedLogos = this.props.data.groups.reduce(function(newVal, previousVal, key) {
            if(previousVal.brand.selectedLogoTab !== null) {
                newVal[key] = previousVal.brand.selectedLogoTab;
            }
            return newVal;
        }, {});

        const logoColors = this.props.data.groups.reduce(function(newVal, previousVal, key) {
            if(previousVal.brand.color !== null) {
                newVal[key] = previousVal.brand.color;
            } else {
                newVal[key] = '#0078D7';
            }
            return newVal
        }, {});

        this.state = Object.assign(this.state, {logos}, {selectedLogos}, {logoColors});
    }

    _handleClick(group, index) {
        let sectionId = this.props.data.groups[index].sections[0].sectionIdentifier;
        navigateEvent(group, sectionId, 'tab click');
    }

    render() {
        if (propsAreValid(this.props.routes, this)) {
            return (
                <div className="tabs">
                    <ul>
                        {this.state.rootRouteChildren !== null ? this.state.rootRouteChildren.map((item, index) =>
                                <li className="c-hyperlink" key={index}>
                                    <Link
                                        activeClassName="active"
                                        activeStyle={{background: this.state.logoColors[index]}}
                                        to={'/' + item.path || ''} onClick={() => this._handleClick(item.title || '', index)} draggable="false">

                                        {this.state.logos[index] ?
                                            <img src={this.state.logos[index]} alt={item.title} draggable="false"/> :
                                            <p>{item.title}</p>
                                        }

                                        {this.state.selectedLogos[index] ?
                                            <img src={this.state.selectedLogos[index]} alt={item.title} className="selected" draggable="false" /> :
                                                this.state.logos[index] ?
                                            <img src={this.state.logos[index]} alt={item.title} className="selected" draggable="false" /> :
                                                <p className="selected">{item.title}</p>
                                        }
                                    </Link>
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
