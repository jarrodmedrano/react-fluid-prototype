import React from 'react';
import classNames from 'classnames';
import Button from '../button/Button';
import './legacy.scss!';
import sanitizeHtml from 'sanitize-html';
import propsAreValid from '../../lib/util';

class LegacyKSP extends React.Component {

    cleanHtml(dirty) {
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

        let {style, textSide, header, logo, text1, text2, itemBody1, itemHeading1, caption1, caption2, icon1, icon2, media, button, legalText, cardButtonBackground} = this.props.data;

            let buttonBG = cardButtonBackground || this.props.brandColor;

            let templateClass = classNames(`f-align-${textSide}`, `c-feature`);

            let btnStyle = {
                background: buttonBG,
                color: '#FFF',
                marginLeft: '0',
                marginRight: '0'
            };

            let templateStyle = {};

            return (
                <div className="m-feature legacy-feature" data-grid="col-12" onScroll={this._handleScroll}>
                    <div className={templateClass}>
                        {media ? <picture className="feature-image">
                                <source srcSet={media.src}/>
                                <img srcSet={media.src} src={media.src}/>
                            </picture> : null }
                        <div>
                            <div>
                                {logo ? <img className="logo" alt={header} src={logo} /> : null }
                                {header ? <h1 className="c-heading-3"
                                              dangerouslySetInnerHTML={{__html: this.cleanHtml(header)}}/> : null }
                                <div data-grid="col-12" className="c-structured-list">
                                    <ul className="f-column">
                                        <li className="f-row">
                                            {icon1 ?
                                                <div data-grid="col-2 stack-2">
                                                    <img className="c-image" src={icon1}/>
                                                </div> : null }
                                            <div data-grid="col-10">
                                                <p className="c-paragraph-2">
                                                {caption1 || itemHeading1 ? <strong dangerouslySetInnerHTML={{__html: this.cleanHtml(caption1 ? caption1 : itemHeading1)}}/> : null }
                                                </p>
                                            {text1 || itemBody1 ? 
                                                <p className="c-paragraph-4"
                                                    dangerouslySetInnerHTML={{__html: this.cleanHtml(text1 ? text1 : itemBody1)}}/> : null }
                                            </div>
                                        </li>
                                        <li className="f-row">
                                            {icon2 ?
                                                <div data-grid="col-2 stack-2">
                                                    <img className="c-image" src={icon2}/>
                                                </div> : null }
                                            <div data-grid="col-10">
                                                <p className="c-paragraph-2">
                                                    {caption2 ? <strong
                                                            dangerouslySetInnerHTML={{__html: this.cleanHtml(text2)}}/> : null }
                                                </p>
                                                {text2 ? <p className="c-paragraph-4"
                                                            dangerouslySetInnerHTML={{__html: this.cleanHtml(caption2)}}/> : null }
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            {button ? <Button data={this.props.data} style={btnStyle}/> : null }
                            {/*{button ? <ButtonLink to={button.link ? button.link : null} className="c-call-to-action c-glyph"*/}
                            {/*aria-label={button.text} style={btnStyle}*/}
                            {/*children={button.text}/> : null}*/}
                            {legalText ? <p className="c-paragraph-4"
                                            dangerouslySetInnerHTML={{__html: this.cleanHtml(legalText)}}/> : null }
                        </div>
                    </div>

                </div>
            )
        }
    }
}

export default LegacyKSP