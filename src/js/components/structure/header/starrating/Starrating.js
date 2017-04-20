//! Copyright (C) Microsoft Corporation. All rights reserved.
import React from 'react';
import ButtonLink from '../../../generic/link/ButtonLink';
import propsAreValid from '../../../../lib/util';
import Text from '../../../generic/text/Text';

class Starrating extends React.Component {

    render() {
      if(propsAreValid(this.props.data, this)) {
        let {rating, bestRating, reviewLink, ratingText} = this.props.data;

        return (
            <div className="c-rating f-community-rated f-user-rated f-aggregate">
                <p className="x-screen-reader"><Text data={ratingText} />
                    <span itemProp="ratingValue">{rating}</span>/
                    <span itemProp="bestRating">{bestRating}</span>
                </p>
                <div aria-hidden="true">
                    <span className="c-glyph f-full" />
                    <span className="c-glyph f-full" />
                    <span className="c-glyph f-full" />
                    <span className="c-glyph f-full" />
                    <span className="c-glyph f-none" />
                </div>

                <span className="c-label">
                    <ButtonLink to={reviewLink} className="track-link c-hyperlink" aria-label={ratingText} children={ratingText} draggable="false" />
                </span>
            </div>
        )
      } return null
    }
}

export default Starrating
