import React from 'react';
import classNames from 'classnames';
import Button from '../../../../generic/button/Button';
import Text from '../../../../generic/text/Text';
import propsAreValid from '../../../../../lib/util';
import {transform} from 'staxmanade/CssToReact.git/transform';

class LegacyCenteredBackdrop extends React.Component {

    render() {
        if (propsAreValid(this.props.data, this)) {
            {/*
             This component renders ksp
             Perhaps clone with an external switch to handle the 'reversed' and 'rs' variants
             */
            }
            let defaultColor = '#fff',
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
                header, subheader, button, legalText, textSide, media
            } = this.props.data;

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

            let transformedStyle = style ? transform(style) : null;

            //take template style and style and merge them (if style exists)
            let mergedStyle = transformedStyle && templateStyle ? Object.assign(templateStyle, transformedStyle) : null;

            return (
                <div className={templateClass} style={mergedStyle || templateStyle}>
                    <div>
                        <div className="content-animate">
                            <div>
                                <div>
                                    {header ? <h1 className="c-heading"><Text data={header} /></h1> : null }
                                    {subheader ? <p className="c-paragraph-1"><Text data={subheader} /></p> : null }
                                </div>
                            </div>
                            {button ? <Button data={this.props.data.button} style={btnStyle} /> : null }
                            {legalText ? <p className="c-paragraph-4"><Text data={legalText} /></p> : null }
                        </div>
                    </div>
                    {media ?
                        <picture className="c-image">
                            <source srcSet={media.src} />
                            <img srcSet={media.src} src={media.src} />
                        </picture> : null
                    }
                </div>
            )
        }
    }
}

export default LegacyCenteredBackdrop