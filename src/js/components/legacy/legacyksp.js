import React from 'react';
import classNames from 'classnames';
import Button from '../button/Button';
import './legacy.scss!';
import sanitizeHtml from 'sanitize-html';
import propsAreValid from '../../lib/util';
import _ from 'lodash';

class LegacyKSP extends React.Component {
    //TODO: stub this out into ../../lib/util
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

    _cssSplit(str){
        var O= {},
            S= str.match(/([^ :;]+)/g) || [];
        while(S.length){
            O[S.shift()]= S.shift() || '';
        }
        return _.mapKeys(O, function (v, k) {return _.camelCase(k)});
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
                style, textSide, header, logo, text1, text2, itemBody1, itemHeading1, caption1, caption2, icon1, icon2, media, button, legalText
            } = this.props.data;

            let templateClass = classNames(`f-align-${textSide}`, `c-feature`);

            let templateStyle = this._cssSplit(style);

            let btnStyle = {
                background: cardButtonBackground,
                color: cardButton,
                marginLeft: '0',
                marginRight: '0'
            };

            let headerStyle = { 
                color: this.props.brandColor 
            }

            return (
                <div className="m-feature legacy-feature" data-grid="col-12" style={templateStyle ? templateStyle : null}>
                    <div className={templateClass}>
                        {media ? <picture className="feature-image">
                                <source srcSet={media.src}/>
                                <img srcSet={media.src} src={media.src}/>
                            </picture> : null }
                        <div>
                            <div>
                                {logo ? <img className="logo" alt={header} src={logo} /> : null }
                                {header ? <h1 className="c-heading-3" className="c-heading" style={headerStyle}
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
                                                    {caption1 || itemHeading1 ? <strong
                                                            dangerouslySetInnerHTML={{__html: this.cleanHtml(caption1 ? caption1 : itemHeading1)}}/> : null }
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