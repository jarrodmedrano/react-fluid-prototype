import React from 'react'
import '../../styles/main.scss!';
import Vertical from '../components/vertical/Vertical';
import StickyBanner from '../components/stickynav/StickyBanner';
import Tabs from '../components/stickynav/Tabs';
import Footer from '../components/stickynav/Footer';
import Button from '../components/button/Button';
import _ from 'lodash';

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
            <div>
                {groups.length > 1 ? <Tabs data={this.props.data} {...this.props} /> : null }
                {oemGroup.brand ?
                  <StickyBanner data={currentPage}>
                    <div className="cta">
                        <Button data={this.props.currentPage}  />
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
                {currentPage.sections ? <Footer footer={currentPage.sections} /> : null}
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
