import React from 'react'
import Starrating from 'js/components/starrating/Starrating'
import Button from 'js/components/button/Button'
import _ from 'lodash';

class StickyBanner extends React.Component {
    render() {

        let retailerGroup = _.find(this.props.groups, function(result) {
            if(result.groupIdentifier === 'retailer') {
                return result
            }
        });

        let oemGroup = _.find(this.props.groups, function (result) {
            if (result.groupIdentifier === 'oem') {
                return result
            }
        });

        let {title, logo} = oemGroup.brand;

        return (
            <div className="sticky-banner sticky-header">
                { (logo && title) ? <img src={ logo } alt={ title } className="logo"/> : null }
                { title ? <h4 className="c-heading-4">{ title }</h4> : null }

                { this.props.ratings ? <Starrating data={ this.props.ratings } /> : null }

                {/*
                    TODO: Look in the retailer group's brand object to see if it has a 'compareModels' link.  If so use that for the button.
                    Otherwise see if it has a compareModels section and set the link to that.
                    else don't show the button at all.
                    We will need to extract the SKU from the deviceInformation so that we can pass it to the compare models uri.
                */}

                {/*
                    TODO: Design the values for displaying price.  Sale price vs MSRP, time limit messaging etc...
                */}

                <div className="cta">
                    <div className="c-label">{ this.props.price.label } <span className="c-heading-5">{ this.props.price.price }</span></div>
                    <Button pathname={retailerGroup.groupIdentifier} hash="#comparemodels" title="Compare Models" />
                </div>
            </div>
        )
    }
}

export default StickyBanner
