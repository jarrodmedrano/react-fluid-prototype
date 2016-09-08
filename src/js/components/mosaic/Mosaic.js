import React from 'react'
import MosaicContainer from './MosaicContainer'
import classNames from 'classnames';
import './mosaic.scss';

class Mosaic extends React.Component {

    constructor(props) {
        super(props)
    }

    _handleClick(event) {
        event.preventDefault();
        this.props.mosaic.ctaURL ? window.open(this.props.mosaic.ctaURL) : null;
    }

    render() {

        let mosaicClass = classNames(
            this.props.mosaic.context ? this.props.mosaic.context : null
        );

        let { mosaicCta, ctaURL, logo, mosaicTitle, mosaicSize, mosaicStyle, mosaicImage, mosaicHeading, mosaicSubHeading, mosaicOverlay } = this.props.mosaic;


        return(

            <div className="theme-dark" data-f-mosaic={mosaicSize} style={mosaicStyle}>
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
                                { mosaicTitle ? <h2 className="c-heading c-heading-4">{ mosaicTitle }</h2> : null }
                                <p className="c-subheading">{ mosaicSubHeading }</p>
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
                            { mosaicTitle ? <div><h3 className="c-heading">{mosaicTitle}</h3></div> : null }
                            { mosaicCta ?
                                <div className="c-group">
                                    <a href={ctaURL ? ctaURL : null} className="c-call-to-action c-glyph c-glyph-go" ><span>{mosaicCta}</span></a>
                                </div>
                            : null }
                    </div>) : null }
                </article>
            </div>
        )
    }
}

export default Mosaic

