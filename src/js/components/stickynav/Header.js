import React from 'react'
import Starrating from 'js/components/starrating/Starrating'
import Button from 'js/components/button/Button'



class StickyBanner extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            brandLogo: require(`img/${this.props.branding.logo}`)
        }
    }

    render() {

        let brand = this.props.branding;

        return (
            <div className="sticky-banner sticky-header">
                { brand ? <img src={ this.state.brandLogo } alt={ brand.title } className="logo"/> : null }
                { brand ? <h4 className="c-heading-4">{ brand.title }</h4> : null }

                { this.props.starRating ? <Starrating data={ this.props.starRating } /> : null }

                <div className="cta">
                    <div className="c-label">{ this.props.price.label } <span className="c-heading-5">{ this.props.price.price }</span></div>
                    {/*<Button data={ this.props.header } />*/}
                </div>
            </div>
        )
    }
}

export default StickyBanner
