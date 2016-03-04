import React from 'react'
import 'src/js/components/mosaic/mosaic.scss!';

var Mosaic = React.createClass({

    render() {

        return(
            <div className="theme-dark" data-f-mosaic={this.props.mosaic.mosaicSize} style={this.props.mosaic.mosaicStyle}>
                <article className="c-placement context-music-album f-width-small f-height-large">
                    {this.props.mosaic.mosaicImage ? <picture>
                        <img srcSet={this.props.mosaic.mosaicImage} src={this.props.mosaic.mosaicImage}
                             alt={this.props.mosaic.mosaicTitle}/>
                    </picture> : null
                    }

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

