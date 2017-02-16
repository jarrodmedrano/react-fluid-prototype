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

class VerticalPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { shortcut: null }
    }
    render() {
        if (propsAreValid(this.props.data)) {
            let title = this.props.route.title;
            let {ratings, deviceInformation, groups} = this.props.data;

            let currentPage = _.find(groups, function (result) {
                return result.groupIdentifier === title
            });

            let currentBrandColor = currentPage.brand.color;

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
                        {currentPage.sections ?
                            currentPage.sections.map(function (result, id) {
                                return (
                                    <Vertical key={id} data={result} brandColor={currentBrandColor} />
                                )
                            }, this)
                            : null
                        }
                    </main>
                    {currentPage.sections ? <Footer data={currentPage}/> : null}
                </div>
            )
        }
    }
}

VerticalPage.propTypes = dataPropTypes(verticalPagePropTypes);

export default VerticalPage
