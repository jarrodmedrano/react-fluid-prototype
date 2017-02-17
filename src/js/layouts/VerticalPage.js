import React from 'react'
import '../../styles/mwf-west-european-default.min.css!';
import '../../styles/mwf-ie9-west-european-default.min.css!';
import '../../styles/main.scss!';
import Vertical from '../components/vertical/Vertical';
import StickyBanner from '../components/stickynav/StickyBanner';
import Tabs from '../components/stickynav/Tabs';
import Footer from '../components/stickynav/Footer';
import StickyButton from '../components/stickynav/StickyButton';
import _ from 'lodash';

import dataPropTypes, {verticalPagePropTypes} from '../../data/dataProps';
import propsAreValid from '../lib/util';
//Common Scrolling Functions
import Scroll  from 'react-scroll';
export const Link       = Scroll.Link;
export const Element    = Scroll.Element;
export const Events     = Scroll.Events;
export const scroll     = Scroll.animateScroll;
export const scrollSpy  = Scroll.scrollSpy;
//TODO: replace this library with regular event listeners.
import keydown from 'react-keydown';

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

        //set Current page in the state
        this.state = {
            currentPage: currentPage,
            currentBrandColor: currentBrandColor,
            currentSections: currentSections,
            currentPaths: currentPaths,
            currentId: currentId
        }
    }

    @keydown( 'cmd+right', 'ctrl+right' )
    nextGroup(e) {
        e.preventDefault();
        if(this.state.currentId < this.state.currentPaths.length-1) {
            return this.props.history.push(this.state.currentPaths[this.state.currentId + 1]);
        } else {
            return this.props.history.push("/");
        }
    }

    @keydown( 'cmd+left', 'ctrl+left')
    prevGroup(e) {
        e.preventDefault();
        if(this.state.currentId === -1) {
            return this.props.history.push(this.state.currentPaths[this.state.currentPaths.length - 1]);
        } else if(this.state.currentId > 0) {
            return this.props.history.push(this.state.currentPaths[this.state.currentId - 1]);
        } else {
            return this.props.history.push("/");
        }
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
                            {retailerGroup ?
                                <StickyButton data={retailerGroup} />
                                : null
                            }
                        </StickyBanner>
                    : null }
                    <main id="main">
                        {this.state.currentPage.sections ?
                            this.state.currentPage.sections.map(function (result, id) {
                                return (
                                    <Vertical key={id} data={result} brandColor={this.state.currentBrandColor} />
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
