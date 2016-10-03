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
                        <section className={mosaicClass}>
                            { mosaicImage ? <picture>
                                <source srcSet="http://placehold.it/890x800/171717/2F2F2F" media="(min-width:1779px)" />
                                    <source srcSet="http://placehold.it/800x800/171717/2F2F2F" media="(min-width:1400px)" />
                                        <source srcSet="http://placehold.it/700x800/171717/2F2F2F" media="(min-width:1084px)" />
                                            <source srcSet="http://placehold.it/1083x400/171717/2F2F2F" media="(min-width:768px)" />
                                                <source srcSet="http://placehold.it/768x400/171717/2F2F2F" media="(min-width:540px)" />
                                                    <source srcSet="http://placehold.it/540x300/171717/2F2F2F" media="(min-width:0)" />
                                                        <img srcSet="http://placehold.it/540x300/171717/2F2F2F" src="http://placehold.it/540x300/171717/2F2F2F" alt="Placeholder with grey background and dimension watermark without any imagery" />
                            </picture> : null }
                            <div>
                                <h3 className="c-heading">Pattern 2 Item 1 - Title</h3>
                                <p className="c-subheading">Pattern 2 Item 1 - Subtitle</p>
                                <div>
                                    <a href="#" className="c-call-to-action c-glyph">
                                        <span>CALL TO ACTION</span>
                                    </a>
                                </div>
                            </div>
                        </section>
                    </div>



            // <div className="theme-dark" data-f-mosaic={mosaicSize} style={mosaicStyle}>
            //     <article className={mosaicClass}>
            //
            //         { mosaicImage ? <picture>
            //             <img srcSet={mosaicImage} src={mosaicImage}
            //                  alt={ mosaicTitle ? mosaicTitle : null } />
            //         </picture> : null
            //         }
            //
            //         { mosaicOverlay ? <div className="c-image-overlay" aria-hidden="true"></div> : null }
            //
            //         {
            //             mosaicSubHeading ? (
            //                 <div>
            //                     { mosaicTitle ? <h2 className="c-heading c-heading-4">{ mosaicTitle }</h2> : null }
            //                     <p className="c-subheading">{ mosaicSubHeading }</p>
            //                 </div>
            //             )
            //             : null
            //         }
            //
            //         { mosaicHeading ? (
            //             <div>
            //                 <div className="c-image-container">
            //                     { logo ? <img src={logo ? logo : null } className="c-image" /> : null }
            //                 </div>
            //
            //                 { mosaicTitle ? <h1 className="c-heading">{ mosaicTitle }</h1> : null }
            //
            //                 { mosaicCta ?
            //                     <div className="c-group">
            //                         <a href={ctaURL ? ctaURL : null} className="c-call-to-action c-glyph c-glyph-go" ><span>{mosaicCta}</span></a>
            //                     </div>
            //             : null }
            //             </div>)
            //         : null }
            //
            //         { mosaicCta ?
            //         (<div>
            //                 { mosaicTitle ? <div><h3 className="c-heading">{mosaicTitle}</h3></div> : null }
            //                 { mosaicCta ?
            //                     <div className="c-group">
            //                         <a href={ctaURL ? ctaURL : null} className="c-call-to-action c-glyph c-glyph-go" ><span>{mosaicCta}</span></a>
            //                     </div>
            //                 : null }
            //         </div>) : null }
            //     </article>
            // </div>
        )
    }
}

export default Mosaic

