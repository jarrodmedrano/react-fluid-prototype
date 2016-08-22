import React from 'react'
import MosaicContainer from 'src/js/components/mosaic/MosaicContainer'
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
            this.props.mosaic.context ? this.props.mosaic.context : null
        );

        let { mosaicCta, ctaURL, logo, mosaicTitle, mosaicSize, mosaicStyle, mosaicImage, mosaicHeading, mosaicSubHeading, mosaicOverlay } = this.props.mosaic;


        return(

            <div className="theme-dark" data-f-mosaic={mosaicSize} style={mosaicStyle} onClick={this._handleClick.bind(this)} onTouchEnd={this._handleClick}>
                <article className={mosaicClass}>

                    { mosaicImage ? <picture>
                        <img srcSet={mosaicImage} src={mosaicImage}
                             alt={ mosaicTitle ? mosaicTitle : null } />
                    </picture> : null
                    }

                    { mosaicOverlay ? <div className="c-image-overlay" aria-hidden="true"></div> : null }

                    {
                        mosaicSubHeading ? (
                            <div>
                                <h2 className="c-heading c-heading-4">Accessories</h2>
                                <p className="c-subheading">The perfect complements to your Surface Book, to help you be more
                        creative and productive than ever.</p>
                            </div>
                        )
                        : null
                    }

                    { mosaicHeading ? (
                        <div>
                            <div className="c-image-container">
                                { logo ? <img src={logo ? logo : null } className="c-image" /> : null }
                            </div>

                            { mosaicTitle ? <h1 className="c-heading">{ mosaicTitle }</h1> : null }

                            { mosaicCta ?
                                <div className="c-group">
                                    <a href={ctaURL ? ctaURL : null} className="c-call-to-action c-glyph c-glyph-go" ><span>{mosaicCta}</span></a>
                                </div>
                        : null }
                        </div>)
                    : null }

                    { mosaicCta ?
                    (<div>
                        <dl>
                            { mosaicTitle ? <dt className="x-screen-reader"> mosaicTitle </dt> : null }
                            { mosaicTitle ? <dd><cite> mosaicTitle </cite></dd> : null }
                            { mosaicCta ?
                                <div className="c-group">
                                    <a href={ctaURL ? ctaURL : null} className="c-call-to-action c-glyph c-glyph-go" ><span>{mosaicCta}</span></a>
                                </div>
                            : null }
                        </dl>
                    </div>) : null }
                </article>
            </div>
        )
    }
}

export default Mosaic

