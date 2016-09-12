import React from 'react'
import Starrating from '../starrating/Starrating'
import Button from '../button/Button'

class Header extends React.Component {

    render() {

        let brand = this.props.branding;

        return (
            <div className="sticky-banner sticky-header">
                { brand ? <img src={ brand.logo } alt={ brand.title } className="logo"/> : null }
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

export default Header
