import React from 'react';
import Starrating from '../starrating/Starrating';
import propsAreValid from '../../../../lib/util';

class StickyBanner extends React.Component {
    render() {
        if(propsAreValid(this.props.brand, this)) {
        let {anchorTitle, logo, groupIdentifier} = this.props.brand;

        return (
            <div className="sticky-banner sticky-header">
                {logo ? <img src={logo} alt={groupIdentifier} className="logo" draggable="false"/> : null }
                {anchorTitle ? <h4 className="c-heading-5">{anchorTitle}</h4> : null }
                {this.props.ratings ? <Starrating data={this.props.ratings} /> : null }

                <div className="cta">
                    {this.props.children}
                </div>
                
                {/*
                    TODO: Look in the retailer group's brand object to see if it has a 'compareModels' link.  If so use that for the button.
                    Otherwise see if it has a compareModels section and set the link to that.
                    else don't show the button at all.
                    We will need to extract the SKU from the deviceInformation so that we can pass it to the compare models uri.
                */}

                {/*
                    TODO: Design the values for displaying price.  Sale price vs MSRP, time limit messaging etc...
                */
                }
                
            </div>
        )
      } return null
    }
}

export default StickyBanner
