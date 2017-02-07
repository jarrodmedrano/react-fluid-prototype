import React from 'react';
import classNames from 'classnames';
import Heading from '../heading/Heading';
import './legacy.scss!';
import Picture from '../picture/Picture';
import ButtonLink from '../link/ButtonLink';
import sanitizeHtml from 'sanitize-html';
import {Link, Element, Events, scroll, scrollSpy, _handleSetActive} from '../../lib/scroll';

class LegacyFeature extends React.Component {


    _cleanHtml(dirty) {
        return sanitizeHtml(dirty, {
            allowedTags: [ 'b', 'i', 'em', 'strong', 'a', 'span' ],
            allowedAttributes: {
                'a': [ 'href', 'style' ],
                'span': [ 'style' ],
                'b': [ 'style' ],
                'p': [ 'style' ]
            }
        });
    }

    render() {
        {/* 
            This component renders both feature and featureCTA
        */ }

        let { style, textSide, header, logo, text1, text2, text3, media, button, legalText } = this.props.data;

        let templateClass = classNames(`f-x-${textSide}`, `f-y-center`, `f-align-${textSide}`, `c-feature`);

        let btnStyle = {
            background: '#E2231A',
            color: '#FFF',
            marginLeft: '0',
            marginRight: '0'
        };

        return (
            <div className="m-feature" data-grid="col-12">
                <div className={templateClass}>
                {media.blockType === 'gif' ? <picture className="feature-image">
                        <source srcSet={media.src} />
                        <img srcSet={media.src} src={media.src} />
                    </picture> : null }
                {media.blockType === 'img' ? <picture className="feature-image">
                        <source srcSet={media.src} />
                        <img srcSet={media.src} src={media.src} />
                    </picture> : null }
                {media.blockType === 'video' ?
                    <div id="videoPlayer1" className="c-video" >
                                <video className="f-video-player" preload="metadata" loop muted aria-labelledby="videoPlayer1Name" autoPlay aria-describedby="videoPlayer1Description"> <source src={media.src} type="video/mp4" />
                                </video>
                        <div className="f-video-cc-overlay" aria-hidden="true"></div>
                    </div>
                : null}
                <div>
                    <div>
                        {header ? <h1 className="c-heading"  dangerouslySetInnerHTML={{ __html: this._cleanHtml(header) }} /> : null }
                        {text1 ? <p className="c-paragraph-1" dangerouslySetInnerHTML={{ __html: this._cleanHtml(text1) }} /> : null }
                        {text2 ? <p className="c-paragraph" dangerouslySetInnerHTML={{ __html: this._cleanHtml(text2) }} /> : null }
                        {text3 ? <p className="c-paragraph" dangerouslySetInnerHTML={{ __html: this._cleanHtml(text3) }} /> : null }
                    </div>
                    {button ? <div><ButtonLink to={button.link ? button.link : null} className="c-call-to-action c-glyph" aria-label={button.text} style={btnStyle} children={button.text}  /></div> : null}
                    {legalText ? <p className="c-paragraph-4" dangerouslySetInnerHTML={{ __html: this._cleanHtml(legalText) }} /> : null }
                </div>
            </div>
         </div>
        )
    }
}

export default LegacyFeature