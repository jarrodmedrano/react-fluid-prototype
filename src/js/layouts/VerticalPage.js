import React from 'react'
import { findDOMNode } from 'react-dom'
import '../../styles/mwf-west-european-default.min.css!';
import '../../styles/mwf-ie9-west-european-default.min.css!';
import '../../styles/main.scss!';
import dataPropTypes, {verticalPagePropTypes} from '../../data/dataProps';
import propsAreValid from '../lib/util';
import Vertical from '../components/vertical/Vertical';
import StickyBanner from '../components/stickynav/StickyBanner';
import Tabs from '../components/stickynav/Tabs';
import Footer from '../components/stickynav/Footer';
import StickyButton from '../components/stickynav/StickyButton';
import Price from '../components/price/Price';
import _ from 'lodash';
import keydown from 'react-keydown';
import Scroll  from 'react-scroll';
import Element from '../components/scrollElement/Element';

let scroller = Scroll.scroller;

class VerticalPage extends React.Component {
    constructor(props) {
        super(props);
        let title = this.props.route.title;
        let {groups} = this.props.data;

        //Find the title of the group and if it's the same title as the route, that's the current page
        let currentPage = _.find(groups, function (result) {
            return result.groupIdentifier === title
        });

        let currentBrandColor = currentPage.brand.color;

        let currentPaths = _.map(this.props.routes[0].childRoutes, 'path');

        let currentId = currentPaths.indexOf(title);

        //start at the first section
        let currentSections = currentPage.sections;

        let currentSectionClass = `${title}-section-`;

        //set Current page in the state
        this.state = {
            currentPage: currentPage,
            currentBrandColor: currentBrandColor,
            currentSections: currentSections,
            currentPaths: currentPaths,
            currentId: currentId,
            currentSection: 0,
            currentSectionClass: currentSectionClass,
            currentTitle: title,
            events: ['scroll', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll', 'resize', 'touchmove', 'touchend'],
        }
    }


    @keydown('cmd+right', 'ctrl+right')
    nextGroup(e) {
        e.preventDefault();
        if (this.state.currentId < this.state.currentPaths.length - 1) {
            return this.props.history.push(this.state.currentPaths[this.state.currentId + 1]);
        } else {
            return this.props.history.push("/");
        }
    }

    @keydown('cmd+left', 'ctrl+left')
    prevGroup(e) {
        e.preventDefault();
        if (this.state.currentId === -1) {
            return this.props.history.push(this.state.currentPaths[this.state.currentPaths.length - 1]);
        } else if (this.state.currentId > 0) {
            return this.props.history.push(this.state.currentPaths[this.state.currentId - 1]);
        } else {
            return this.props.history.push("/");
        }
    }

    @keydown('cmd+down', 'ctrl+down')
    nextSection(e) {
        e.preventDefault();
        if (this.state.currentSection + 1 < this.state.currentSections.length) {
            scroller.scrollTo(`${this.state.currentTitle}-section-${this.state.currentSection += 1}`);
        } else {
            return false
        }
    }

    @keydown('cmd+up', 'ctrl+up')
    prevSection(e) {
        e.preventDefault();
        if (this.state.currentSection - 1 >= 0) {
            scroller.scrollTo(`${this.state.currentTitle}-section-${this.state.currentSection -= 1}`);
        } else {
            return false
        }
    }

    @keydown('alt+0', 'alt+1', 'alt+2', 'alt+3', 'alt+4', 'alt+5', 'alt+6', 'alt+7', 'alt+8', 'alt+9')
    toSection(e) {
        e.preventDefault();
        let sectionKeys = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57];

        sectionKeys.map(function (result, id) {
            if (id < this.state.currentSections.length && e.which === result) {
                return scroller.scrollTo(`${this.state.currentTitle}-section-${this.state.currentSection + id}`);
            }
        }, this);
    }

    render() {
        if (propsAreValid(this.props.data)) {
            let {ratings, deviceInformation, groups} = this.props.data;

            let oemGroup = _.find(groups, function (result) {
                if (result.groupIdentifier === 'oem') {
                    return result
                }
            });

            let retailerGroup = _.find(groups, function (result) {
                if (result.groupIdentifier === 'retailer') {
                    return result
                }
            });

            return (
                <div>
                    {groups.length > 1 ? <Tabs data={this.props.data} {...this.props}  /> : null }
                    {oemGroup ? 
                        <StickyBanner data={oemGroup}>
                            { oemGroup.brand.price ? 
                                <Price data={oemGroup.brand.price}/> 
                            : null }
                            
                            { retailerGroup ? 
                                <StickyButton data={retailerGroup} /> 
                            : null }
                        </StickyBanner> 
                    : null }
                    
                    <main id="main">
                        {this.state.currentPage.sections ?
                            this.state.currentPage.sections.map(function (result, id) {
                                return (
                                    <Element name={this.state.currentSectionClass + id} key={id}>
                                        <Vertical data={result} brandColor={this.state.currentBrandColor} />
                                    </Element>
                                )
                            }, this)
                            : null
                        }
                    </main>
                    {this.state.currentPage.sections ? <Footer data={this.state.currentPage}/> : null}
                </div>
            )
        }
    }
}

VerticalPage.propTypes = dataPropTypes(verticalPagePropTypes);

export default VerticalPage
