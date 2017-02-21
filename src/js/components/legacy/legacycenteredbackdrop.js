import React from 'react';
import classNames from 'classnames';
import Button from '../button/Button';
import './legacy.scss!';
import Picture from '../picture/Picture';
import ButtonLink from '../link/ButtonLink';
import sanitizeHtml from 'sanitize-html';

class LegacyCenteredBackdrop extends React.Component {

    componentDidMount() {
        document.querySelector('.m-hero-item').addEventListener('scroll', this._handleScroll);
    }

    componentWillUnmount() {
        document.querySelector('.m-hero-item').removeEventListener('scroll', this._handleScroll);
    }

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
            This component renders ksp
            Perhaps clone with an external switch to handle the 'reversed' and 'rs' variants
        */ }

        let { cardColor, cardBackground, cardThemeColor, cardButtonBackground, CardButtonHoverBackground, cardThemeFont,  cardButton, header, subheader, button, legalText, textSide, media } = this.props.data;

        // alignX, alignY, and theme need to be assumed in the css since they will not be available in the data
        let templateClass = classNames(`f-x-${textSide}`, `f-y-center`, `f-align-center`, `theme-light m-hero-item`);

        let buttonBG = cardButtonBackground || this.props.brandColor;


        let btnStyle = {
            color: cardButton,
            background: buttonBG
        };

        let templateStyle = {
            background: cardBackground,
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% auto',
            color: cardColor,
        };

        {/*
            'style' was included to adjust local values.  We may need to inventory to see what has been used here.

            in the first list consider all values optional
            referr to the original template centeredBackdropTemplate.html for how style was applied

            if button != null
            button.blockType will be "buttonExternal" or "buttonInternal"
            button.text
            if external
                button.link
            else if internal
                button.toPage

            Need style elements for all of these to make it look similar to the previous layout
        */}

        return (
            <div className={templateClass} style={templateStyle} onScroll={this._handleScroll}>
                <div>
                    <div className="content-animate">
                        <div>
                            <div>
                        {header ? <h1 className="c-heading"  dangerouslySetInnerHTML={{ __html: this._cleanHtml(header) }} /> : null }
                        {subheader ? <p className="c-paragraph-1" dangerouslySetInnerHTML={{ __html: this._cleanHtml(subheader) }} /> : null }
                            </div>
                        </div>
                        {button ? <div><ButtonLink to={button.link ? button.link : null} className="c-call-to-action c-glyph" aria-label={button.text} style={btnStyle} children={button.text}  /></div> : null}
                        {legalText ? <p className="c-paragraph-4" dangerouslySetInnerHTML={{ __html: this._cleanHtml(legalText) }} /> : null }

                    </div>
                </div>
                {media ? <picture className="c-image">
                   <source srcSet={media.src} />
                    <img srcSet={media.src} src={media.src} />
                </picture> : null }
            </div>
        )
    }
}

export default LegacyCenteredBackdrop