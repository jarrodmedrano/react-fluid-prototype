import React from 'react'
import classNames from 'classnames';
import 'src/js/components/mosaic/mosaic.scss!';

class Mosaic extends React.Component {

    constructor(props) {
        super(props)
    }

    _handleClick(event) {
        event.preventDefault();
        this.props.mosaic.ctaURL ? window.open(this.props.mosaic.ctaURL) : window.open('http://www.microsoftstore.com/');
    }

    render() {

        let mosaicClass = classNames(
            this.props.mosaic.context ? this.props.mosaic.context : 'context-music-album',
            'c-placement f-width-small f-height-large'
        );

        let { mosaicCta, ctaURL, logo, mosaicTitle, mosaicSize, mosaicStyle, mosaicImage, mosaicHeading } = this.props.mosaic;

        return(

            <div className="theme-dark" data-f-mosaic={mosaicSize} style={mosaicStyle} onClick={this._handleClick.bind(this)} onTouchEnd={this._handleClick}>
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

                        <div className="c-group">
                            <a href={ctaURL} className="c-call-to-action c-glyph c-glyph-go"><span>{mosaicCta}</span></a>
                        </div>
                    </div>) : null}
                    {mosaicHeading ? null : <div>
                        <dl>
                            <dt className="x-screen-reader">{mosaicTitle} Title</dt>
                            <dd><cite>{mosaicTitle}</cite></dd>
                            {mosaicCta ?
                                <div className="c-group">
                                    <a href={ctaURL} className="c-call-to-action c-glyph c-glyph-go" ><span>{mosaicCta}</span></a>
                                </div> : null }
                        </dl>
                    </div>}
                </article>
            </div>
        )
    }
}

export default Mosaic

