import React from 'react'
import Starrating from '../starrating/Starrating'
import Button from '../button/Button'
import _ from 'lodash';
import './sticky-banner.scss!'

class StickyBanner extends React.Component {

    render() {

        let {title, logo} = this.props.oemGroup;

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
                    {/*<Button  />*/}
                </div>
            </div>
        )
    }
}

export default StickyBanner
