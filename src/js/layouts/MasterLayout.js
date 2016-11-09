import React from 'react'
//Components
import VerticalPage from './VerticalPage';
import _ from 'lodash/lodash';


class MasterLayout extends React.Component {

    render() {

        let title = this.props.route.title;
        let { groups } = this.props.data;

        let currentPage = _.find(groups, function(result) {
            return result.groupIdentifier === title
        }, this);

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

        let props = {
            routes : this.props.routes,
            params : this.props.params,
            data : this.props.data,
            currentPage : currentPage,
            oemGroup : oemGroup,
            retailerGroup: retailerGroup
        };

        return (
            <VerticalPage {...props} />
        )
    }
}

MasterLayout.propTypes = {
    routes : React.PropTypes.array.isRequired,
    route : React.PropTypes.object.isRequired,
    params : React.PropTypes.object.isRequired,
    data : React.PropTypes.shape({
        layout: React.PropTypes.string,
        deviceInformation: React.PropTypes.object,
        ratings: React.PropTypes.shape({
            rating: React.PropTypes.string.isRequired,
            bestRating: React.PropTypes.string.isRequired,
            ratingText: React.PropTypes.string.isRequired,
            reviewLink: React.PropTypes.string.isRequired,
        }),
        groups: React.PropTypes.arrayOf(React.PropTypes.shape({
            groupIdentifier: React.PropTypes.string.isRequired,
            brand: React.PropTypes.shape({
                logoTab: React.PropTypes.string.isRequired,
                color: React.PropTypes.string.isRequired,
            }).isRequired,
            sections: React.PropTypes.arrayOf(React.PropTypes.shape({
                groupIdentifier: React.PropTypes.string.isRequired,
                sectionIdentifier: React.PropTypes.string.isRequired,
                layout: React.PropTypes.string.isRequired,
                anchorLink: React.PropTypes.string.isRequired,
                title: React.PropTypes.string.isRequired,
                heading: React.PropTypes.string,
                subheading: React.PropTypes.string,
                paragraph: React.PropTypes.string,
                altText: React.PropTypes.string,
                ariaLabel: React.PropTypes.string,
                pictures: React.PropTypes.arrayOf(React.PropTypes.shape({
                    src: React.PropTypes.string,
                    minwidth: React.PropTypes.string,
                })),
                button: React.PropTypes.shape({
                    layout: React.PropTypes.string,
                    path: React.PropTypes.string,
                    title: React.PropTypes.string,
                    ariaLabel: React.PropTypes.string,
                    textColor: React.PropTypes.string,
                    backgroundColor: React.PropTypes.string,
                }),
                alignX: React.PropTypes.string,
                alignY: React.PropTypes.string,
                theme: React.PropTypes.string,
                video: React.PropTypes.string,
                mosaic: React.PropTypes.shape({
                    theme: React.PropTypes.string,
                    layout: React.PropTypes.string,
                    tiles: React.PropTypes.arrayOf(React.PropTypes.shape({
                        heading: React.PropTypes.string,
                        subheading: React.PropTypes.string,
                        size: React.PropTypes.string,
                        pictures: React.PropTypes.arrayOf(React.PropTypes.shape({
                            src: React.PropTypes.string,
                            minwidth: React.PropTypes.string,
                        })),
                        button: React.PropTypes.shape({
                            layout: React.PropTypes.string,
                            path: React.PropTypes.string,
                            title: React.PropTypes.string,
                            ariaLabel: React.PropTypes.string,
                            textColor: React.PropTypes.string,
                            backgroundColor: React.PropTypes.string,
                        }),
                    }))
                }),
            })).isRequired,
        })).isRequired,
    }),
};

export default MasterLayout