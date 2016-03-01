import React from 'react'
import 'src/js/components/mosaic/mosaic.scss!';

var Mosaic = React.createClass({

    render() {
        return(
            <div className="theme-dark" data-f-mosaic={this.props.mosaicSize}>
                <article className="c-placement context-accessory f-width-small f-height-large">
                    <picture>
                        <img srcSet={this.props.mosaicImage} src={this.props.mosaicImage} alt={this.props.mosaicTitle} />
                    </picture>

                    <div className="c-image-overlay" aria-hidden="true"></div>
                    <div>
                        <dl>
                        <dt className="x-screen-reader">Game Title</dt>
                        <dd><cite>{this.props.mosaicTitle}</cite></dd>
                        <div className="c-group">
                            <a href="/components/items/mosaic.html" className="c-call-to-action c-glyph"><span>Buy now</span></a>
                        </div>
                      </dl>
                    </div>
                </article>
            </div>
        )
    }
});

export default Mosaic

