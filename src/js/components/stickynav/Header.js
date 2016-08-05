import React from 'react'

class Header extends React.Component {

    render() {
        return (
            <div className="sticky-banner sticky-header">
                <img src="img/vertical/ms-logo.png" alt="Microsoft" className="logo"/>
                <h4 className="c-heading-4">Surface Book</h4>
                <div className="c-rating f-community-rated f-user-rated f-aggregate">
                    <p className="x-screen-reader">Rating:
                        <span itemprop="ratingValue">3</span>/
                        <span itemprop="bestRating">5</span>
                    </p>
                    <div aria-hidden="true">
                        <span className="c-glyph f-full"></span>
                        <span className="c-glyph f-full"></span>
                        <span className="c-glyph f-full"></span>
                        <span className="c-glyph f-full"></span>
                        <span className="c-glyph f-none"></span>
                    </div>

                    <span className="c-label"><a
                        href="https://www.microsoftstore.com/store/msusa/en_US/pdp/Surface-Book/productID.325716000#ratingsandreviews"
                        className="track-link c-hyperlink" id="See-Reviews">See reviews</a></span>
                </div>

                <div className="cta">
                    <div className="c-label">Starting at <span className="c-heading-5">$1,499.99</span></div>
                    <a href="#slide-compare" role="button" className="c-button c-button-primary" id="anchor7">Compare models</a>
                </div>
            </div>
        )
    }
}

export default Header
