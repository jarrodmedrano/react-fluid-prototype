import React from 'react';
import classNames from 'classnames';
import Button from '../button/Button';
import './legacy.scss!';
import sanitizeHtml from 'sanitize-html';
import propsAreValid, {_cssSplit} from '../../lib/util';
import _ from 'lodash';

class LegacyKSP extends React.Component {
    //TODO: stub this out into ../../lib/util
    cleanHtml(dirty) {
        return sanitizeHtml(dirty, {
            allowedTags: ['b', 'i', 'em', 'strong', 'a', 'span', 'br'],
            allowedAttributes: {
                'a': ['href', 'style'],
                'span': ['style'],
                'b': ['style'],
                'p': ['style']
            }
        });
    }

    render() {
        if (propsAreValid(this.props.data, this)) {
            {/*
             This component renders ksp
             Perhaps clone with an external switch to handle the 'reversed' and 'rs' variants
             */
            }

            let {
                cardButtonBackground = this.props.brandColor,
                cardButton = '#fff',
                style, textSide, header, logo, text1, text2, itembody1, itembody2, itemheading1, itemheading2, caption1, caption2, icon1, icon2, media, button, legalText
            } = this.props.data;

            let splitStyle = _cssSplit(style);

            let rtl = _.includes(splitStyle, 'rtl');

            let templateClass = classNames(`f-align-${rtl === true ? `right` : textSide}`, `c-feature`);

            let templateStyle = splitStyle;

            let btnStyle = {
                background: cardButtonBackground,
                color: cardButton,
                marginLeft: '0',
                marginRight: '0'
            };

            let headerStyle = {
                color: this.props.brandColor
            };

            return (
                <div className="m-feature legacy-feature" data-grid="col-12" style={templateStyle ? templateStyle : null}>
                    <div className={templateClass}>
                        {media ? <picture className="feature-image">
                                <source srcSet={media.src}/>
                                <img srcSet={media.src} src={media.src} draggable="false"/>
                            </picture> : null }
                        <div>
                            <div>
                                {logo ? <img className="logo c-image" alt={header} src={logo} /> : null }
                                {header ? <h1 className="c-heading c-logo" style={headerStyle}
                                              dangerouslySetInnerHTML={{__html: this.cleanHtml(header)}}/> : null }

                                <div data-grid="col-12" className="c-structured-list" style={rtl ? {textAlign: 'right'} : null}>
                                    <ul className="f-column">
                                        <li className="f-row">
                                            {icon1 ?
                                                <div data-grid="col-2 stack-2">
                                                    <img className="c-image" src={icon1} draggable="false"/>
                                                </div> : null }
                                            <div data-grid="col-10">
                                                <p className="c-paragraph-2">
                                                    {text1 || itemheading1 ? <strong
                                                            dangerouslySetInnerHTML={{__html: this.cleanHtml(text1 ? text1 : itemheading1 ? itemheading1 : null)}}/> : null }
                                                </p>
                                                {caption1 || itembody1 ?
                                                    <p className="c-paragraph-4"
                                                       dangerouslySetInnerHTML={{__html: this.cleanHtml(caption1 ? caption1 : itembody1 ? itembody1 : null)}}/> : null }
                                            </div>
                                        </li>
                                        <li className="f-row" >
                                            {icon2 ?
                                                <div data-grid="col-2 stack-2">
                                                    <img className="c-image" src={icon2} draggable="false"/>
                                                </div> : null }
                                            <div data-grid="col-10">
                                                <p className="c-paragraph-2">
                                                    {text2 || itemheading2 ? <strong
                                                            dangerouslySetInnerHTML={{__html: this.cleanHtml(text2 ? text2 : itemheading2 ? itemheading2 : null)}}/> : null }
                                                </p>
                                                {caption2 || itembody2 ? <p className="c-paragraph-4"
                                                            dangerouslySetInnerHTML={{__html: this.cleanHtml(caption2 ? caption2 : itembody2 ? itembody2 : null)}}/> : null }
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            {button ? <Button data={this.props.data.button} style={btnStyle} /> : null }
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