import React from 'react'
import Starrating from 'src/js/components/starrating/Starrating'
import Button from 'src/js/components/button/Button'

class Header extends React.Component {

    render() {

        let { title, brand } = this.props.header;

        return (
            <div className="sticky-banner sticky-header">
                { brand ? <img src={ brand.imgUrl } alt={ brand.title } className="logo"/> : null }
                { title ? <h4 className="c-heading-4">{ title }</h4> : null }

                { this.props.starRating ? <Starrating data={ this.props.starRating } /> : null }

                <div className="cta">
                    <div className="c-label">{ this.props.price.label } <span className="c-heading-5">{ this.props.price.price }</span></div>
                    <Button data={ this.props.header } />
                </div>
            </div>
        )
    }
}

export default Header
