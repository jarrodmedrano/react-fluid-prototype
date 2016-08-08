//! Copyright (C) Microsoft Corporation. All rights reserved.

import React from 'react'

class Starrating extends React.Component {

    render() {

        return (
            <div className="c-rating f-community-rated f-user-rated f-aggregate">
                <p className="x-screen-reader">Rating:
                    <span itemprop="ratingValue">{this.props.data.rating}</span>/
                    <span itemprop="bestRating">{this.props.data.bestRating}</span>
                </p>
                <div aria-hidden="true">
                    <span className="c-glyph f-full"></span>
                    <span className="c-glyph f-full"></span>
                    <span className="c-glyph f-full"></span>
                    <span className="c-glyph f-full"></span>
                    <span className="c-glyph f-none"></span>
                </div>

                <span className="c-label"><a
                    href={this.props.data.reviewLink}
                    className="track-link c-hyperlink" id="See-Reviews">See reviews</a></span>
            </div>
        )
    }
}

export default Starrating
