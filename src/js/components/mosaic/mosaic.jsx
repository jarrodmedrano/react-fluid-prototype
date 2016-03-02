import React from 'react'
import 'src/js/components/mosaic/mosaic.scss!';

var Mosaic = React.createClass({

    render() {

        return(
            <div className="theme-dark" data-f-mosaic={this.props.mosaic.mosaicSize}>
                <article className="c-placement context-accessory f-width-small f-height-large">
                    <picture>
                        <img srcSet={this.props.mosaic.mosaicImage} src={this.props.mosaic.mosaicImage} alt={this.props.mosaic.mosaicTitle} />
                    </picture>

                    <div className="c-image-overlay" aria-hidden="true"></div>
                    <div>
                        <dl>
                        <dt className="x-screen-reader">Game Title</dt>
                        <dd><cite>{this.props.mosaic.mosaicTitle}</cite></dd>
                        <div className="c-group">
                            <a href="http://www.microsoftstore.com/" className="c-call-to-action c-glyph"><span>Buy now</span></a>
                        </div>
                      </dl>
                    </div>
                </article>
            </div>
        )
    }
});

export default Mosaic

