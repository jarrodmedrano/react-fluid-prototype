import React from 'react'
import classNames from 'classnames';
import 'src/js/components/mosaic/mosaic.scss!';

var Mosaic = React.createClass({

    render() {

        let mosaicClass = classNames(
            this.props.mosaic.context ? this.props.mosaic.context : 'context-music-album',
            'c-placement f-width-small f-height-large'
        );

        let { logo, mosaicTitle, mosaicSize, mosaicStyle, mosaicImage, mosaicHeading } = this.props.mosaic;

        return(
            <div className="theme-dark" data-f-mosaic={mosaicSize} style={mosaicStyle}>
                <article className={mosaicClass}>
                    {mosaicImage ? <picture>
                        <img srcSet={mosaicImage} src={mosaicImage}
                             alt={mosaicTitle} />
                    </picture> : null
                    }

                    <div className="c-image-overlay" aria-hidden="true"></div>

                    {mosaicHeading ? (<div>
                        <div className="c-image-container">
                            {logo ? <img src={logo} className="c-image" /> : null }
                        </div>

                        <h1 className="c-heading">{ mosaicTitle }</h1>

                        <div class="c-group">
                            <a href="http://www.microsoftstore.com/" className="c-call-to-action c-glyph c-glyph-go"><span>Call to action</span></a>
                        </div>
                    </div>) : null}
                    {mosaicHeading ? null : <div>
                            <dl>
                                <dt className="x-screen-reader">Game Title</dt>
                                <dd><cite>{mosaicTitle}</cite></dd>
                                <div className="c-group">
                                    <a href="http://www.microsoftstore.com/" className="c-call-to-action c-glyph c-glyph-go"><span>Buy now</span></a>
                                </div>
                            </dl>
                    </div>}
                </article>
            </div>
        )
    }
});

export default Mosaic

