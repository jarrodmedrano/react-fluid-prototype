import React from 'react'
import '../../styles/mwf-west-european-default.min.css!';
import '../../styles/mwf-ie9-west-european-default.min.css!';
import '../../styles/main.scss!';
import Vertical from '../components/vertical/Vertical';
import StickyBanner from '../components/stickynav/StickyBanner';
import Tabs from '../components/stickynav/Tabs';
import Footer from '../components/stickynav/Footer';
import ButtonLink from '../components/link/ButtonLink';
import _ from 'lodash';
import dataPropTypes, {verticalPagePropTypes} from '../../data/dataProps';
import {Link, Element, Events, scroll, scrollSpy, _handleSetActive} from '../lib/scroll';

class VerticalPage extends React.Component {


    render() {
        let title = this.props.route.title;
        let {ratings, deviceInformation, groups} = this.props.data;
        let currentPage = _.find(groups, function(result) {
            return result.groupIdentifier === title
        }, {this});
        let oemGroup = _.find(groups, function(result) {
            if(result.groupIdentifier === 'oem') {
                return result
            }
        });
        let retailerGroup = _.find(this.props.groups, function(result) {
            if(result.groupIdentifier === 'retailer') {
                return result
            }
        });

        return (
            <div onScroll={_handleSetActive}>
                {groups.length > 1 ? <Tabs data={this.props.data} {...this.props}  /> : null }
                {oemGroup.brand ?
                  <StickyBanner data={currentPage}>
                    <div className="cta">
                        <div><ButtonLink to="#400" className="c-call-to-action c-glyph"  onChange={this._handleSetActive}>Compare Models</ButtonLink></div>
                    </div>
                  </StickyBanner>
                : null }
                <main id="main">
                    {currentPage.sections ?
                        currentPage.sections.map(function(result, id) {
                            return (
                              <Vertical key={id} data={result} onChange={this._handleSetActive} />
                            )
                        }, this)
                        : null
                    }
                </main>
                {currentPage.sections ? <Footer data={currentPage.sections} onChange={this._handleSetActive} /> : null}
            </div>
        )
    }
}

VerticalPage.propTypes = dataPropTypes(verticalPagePropTypes);

export default VerticalPage
