import React from 'react'
import '../../styles/main.scss!';
import Vertical from '../components/vertical/Vertical';
import StickyBanner from '../components/stickynav/StickyBanner';
import Tabs from '../components/stickynav/Tabs';
import Footer from '../components/stickynav/Footer';
import Button from '../components/button/Button';
import _ from 'lodash';
import Scroll from 'react-scroll';

var Link       = Scroll.Link;
var Element    = Scroll.Element;
var Events     = Scroll.Events;
var scroll     = Scroll.animateScroll;
var scrollSpy  = Scroll.scrollSpy;

class VerticalPage extends React.Component {
    componentDidMount() {
        Events.scrollEvent.register('begin', function(to, element) {
            console.log("begin", arguments);
        });
        Events.scrollEvent.register('end', function(to, element) {
            console.log("end", arguments);
        });
        scrollSpy.update();
    }
    componentWillUnmount() {
        Events.scrollEvent.remove('begin');
        Events.scrollEvent.remove('end');
    }
    _scrollToTop() {
        scroll.scrollToTop();
    }
    _scrollToBottom() {
        scroll.scrollToBottom();
    }
    _scrollTo(target) {
        target.top = target.getBound
        scroll.scrollTo(target);
    }
    _scrollMore() {
        scroll.scrollMore(100);
    }
    _handleSetActive(to) {
        console.log(to);
    }
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
            <div>
                {groups.length > 1 ? <Tabs data={this.props.data} {...this.props} /> : null }
                {oemGroup.brand ?
                  <StickyBanner data={currentPage}>
                    <div className="cta">
                        <div><Link to="#400" spy={true} onClick={this._scrollTo.bind(this)} className="c-call-to-action c-glyph" ><span>Compare Models</span></Link></div>
                    </div>
                  </StickyBanner>
                : null }
                <main id="main">
                    {currentPage.sections ?
                        currentPage.sections.map(function(result, id) {
                            return (
                                <Vertical key={id} data={result} />
                            )
                        })
                        : null
                    }
                </main>
                {currentPage.sections ? <Footer data={currentPage.sections} /> : null}
            </div>
        )
    }
}

// VerticalPage.propTypes = {
//     routes : React.PropTypes.isRequired,
//     params : React.PropTypes.isRequired,
//     data : React.PropTypes.isRequired,
//     ratings : React.PropTypes.isRequired,
//     deviceInformation : React.PropTypes.isRequired,
//     groups: React.PropTypes.isRequired,
//     currentPage: React.PropTypes.isRequired,
//     oemGroup: React.PropTypes.isRequired,
//     retailerGroup: React.PropTypes.isRequired,
//     oemratings: React.PropTypes.isRequired,
//     price : React.PropTypes.isRequired,
//     branding : React.PropTypes.isRequired,
// };

export default VerticalPage
