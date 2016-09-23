import React from 'react'
import Starrating from 'js/components/starrating/Starrating'
import Button from 'js/components/button/Button'
import _ from 'lodash';



class StickyBanner extends React.Component {

    constructor(props) {
        super(props);


        this.state = {
            brandLogo: require(`img/${this.props.branding.logo}`)
        }
    }

    render() {

        let brand = this.props.branding.title;

        let retailerGroup = _.find(this.props.groups, function(result) {
            if(result.groupIdentifier === 'retailer') {
                return result
            }
        });



        return (
            <div className="sticky-banner sticky-header">
                { brand ? <img src={ this.state.brandLogo } alt={ brand } className="logo"/> : null }
                { brand ? <h4 className="c-heading-4">{ brand }</h4> : null }

                { this.props.ratings ? <Starrating data={ this.props.ratings } /> : null }

                <div className="cta">
                    <div className="c-label">{ this.props.price.label } <span className="c-heading-5">{ this.props.price.price }</span></div>
                    <Button pathname={retailerGroup.groupIdentifier} hash="#comparemodels" title="Compare Models" />
                </div>
            </div>
        )
    }
}

export default StickyBanner
