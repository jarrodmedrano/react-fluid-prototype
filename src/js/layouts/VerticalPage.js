import React from 'react'
import '../../styles/main.scss!';
import Vertical from '../components/vertical/Vertical';
import StickyBanner from '../components/stickynav/StickyBanner';
import Tabs from '../components/stickynav/Tabs';
import Footer from '../components/stickynav/Footer';

class VerticalPage extends React.Component {

    render() {

        let {ratings, deviceInformation, groups} = this.props.data;

        let {currentPage, oemGroup, retailerGroup} = this.props;

        let tabsProps = {
            routes : this.props.routes,
            params : this.props.params,
            groups
        };

        let bannerProps = {
            oemratings : ratings,
            price : deviceInformation,
            branding : oemGroup.brand,
            groups,
            currentPage,
            oemGroup,
            retailerGroup
        };

        return (
            <div>
                {groups.length > 1 ? <Tabs {...tabsProps} /> : null }
                {oemGroup.brand ? <StickyBanner {...bannerProps} /> : null }
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
        );
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
