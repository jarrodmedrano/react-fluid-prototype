import React from 'react';
import classNames from 'classnames';
import './legacy.scss!';
import Button from '../button/Button';
import sanitizeHtml from 'sanitize-html';
import propsAreValid, {_cssSplit} from '../../lib/util';

class LegacyCenteredBackdrop extends React.Component {

    _cleanHtml(dirty) {
        return sanitizeHtml(dirty, {
            allowedTags: ['b', 'i', 'em', 'strong', 'a', 'span'],
            allowedAttributes: {
                'a': ['href', 'style'],
                'span': ['style'],
                'b': ['style'],
                'p': ['style']
            }
        });
    }

    render() {
        if(propsAreValid(this.props.data, this)) {
            {/*
             This component renders ksp
             Perhaps clone with an external switch to handle the 'reversed' and 'rs' variants
             */
            }
            let defaultColor ='#fff',
                defaultBG = '#000';

            let {
                cardColor = defaultBG,
                cardBackground,
                cardThemeColor = defaultColor,
                cardButtonBackground = this.props.brandColor,
                CardButtonHoverBackground,
                cardThemeFont,
                style,
                cardButton = defaultColor,
                header, subheader, button, legalText, textSide, media} = this.props.data;

            // alignX, alignY, and theme need to be assumed in the css since they will not be available in the data
            let templateClass = classNames(`f-x-${textSide}`, `f-y-center`, `f-align-center`, `theme-light m-hero-item`);

            let btnStyle = {
                color: cardButton,
                background: cardButtonBackground
            };

            let templateStyle = {
                backgroundColor: cardColor,
                backgroundImage: cardBackground,
                color: cardThemeColor,
                backgroundRepeat: 'no-repeat',
                backgroundSize: '100% auto'
            };

            //take template style and style and merge them (if style exists)
            let mergedStyle = style && templateStyle ? Object.assign(templateStyle, _cssSplit(style)) : null;

            return (
                <div className={templateClass} style={mergedStyle || templateStyle} >
                    <div>
                        <div className="content-animate">
                            <div>
                                <div>
                                    {header ? <h1 className="c-heading"
                                                  dangerouslySetInnerHTML={{__html: this._cleanHtml(header)}}/> : null }
                                    {subheader ? <p className="c-paragraph-1"
                                                    dangerouslySetInnerHTML={{__html: this._cleanHtml(subheader)}}/> : null }
                                </div>
                            </div>
                            {button ? <Button data={this.props.data} style={btnStyle}/> : null }
                            {legalText ? <p className="c-paragraph-4"
                                            dangerouslySetInnerHTML={{__html: this._cleanHtml(legalText)}}/> : null }
                        </div>
                    </div>
                    {media ? <picture className="c-image">
                            <source srcSet={media.src}/>
                            <img srcSet={media.src} src={media.src}/>
                        </picture> : null }
                </div>
            )
        }
    }
}

export default LegacyCenteredBackdrop