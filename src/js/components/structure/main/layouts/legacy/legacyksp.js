import React from 'react';
import classNames from 'classnames';
import Button from '../../../../generic/button/Button';
import Video from '../../../../generic/video/Video';
import Text from '../../../../generic/text/Text';
import propsAreValid, {transform} from '../../../../../lib/util';
import _ from 'lodash';

class LegacyKSP extends React.Component {

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


            let rtl = _.includes(style, 'rtl');

            let templateClass = classNames(`f-align-${rtl === true ? `right` : textSide}`, `c-feature`);

            let templateStyle = style ? transform(style) : null;

            let btnStyle = {
                background: cardButtonBackground,
                color: cardButton,
                marginLeft: '0',
                marginRight: '0'
            };

            let headerStyle = {
                color: this.props.brandColor
            };

            let iconStyle = {
                width: '100%',
                maxWidth: '50px',
                minWidth: '25px',
                display: 'block'
            }

            return (
                <div className="m-feature legacy-feature" data-grid="col-12"
                     style={templateStyle ? templateStyle : null}>
                    <div className={templateClass}>
                        {media.blockType && media.blockType === 'gif' ? <picture className="feature-image">
                            <source srcSet={media.src}/>
                            <img srcSet={media.src} src={media.src} draggable="false"/>
                        </picture> : null }
                        {media.blockType && media.blockType === 'img' ? <picture className="feature-image">
                            <source srcSet={media.src}/>
                            <img srcSet={media.src} src={media.src} draggable="false"/>
                        </picture> : null }
                        {media.blockType && media.blockType === 'video' ?
                            <div id="videoPlayer1" className="c-video">
                                <Video active={this.props.active} data={media} myId={this.props.myId}/>
                                <div className="f-video-cc-overlay" aria-hidden="true" />
                            </div>
                            : null}
                        <div>
                            <div>
                                {logo ? <img className="logo c-image" alt={header} src={logo}/> : null }
                                {header ? <h1 className="c-heading c-logo" style={headerStyle}><Text data={header} /></h1> : null }

                                <div data-grid="col-12" className="c-structured-list"
                                     style={rtl ? {textAlign: 'right'} : null}>
                                    <ul className="f-column">
                                        <li className="f-row">
                                                <div data-grid="col-2 stack-2">
                                                    {icon1 ? <img style={iconStyle} src={icon1} draggable="false"/> : null }
                                                </div>
                                            <div data-grid="col-10">
                                                <p className="c-paragraph-2">
                                                    {text1 || itemheading1 ? <strong><Text data={text1 ? text1 : itemheading1 ? itemheading1 : null} /></strong> : null }
                                                </p>
                                                {caption1 || itembody1 ?
                                                    <p className="c-paragraph-4"><Text data={caption1 ? caption1 : itembody1 ? itembody1 : null} /></p> : null }
                                            </div>
                                        </li>
                                        <li className="f-row">
                                                <div data-grid="col-2 stack-2">
                                                    {icon2 ? <img style={iconStyle} src={icon2} draggable="false"/> : null }
                                                </div>
                                            <div data-grid="col-10">
                                                <p className="c-paragraph-2">
                                                    {text2 || itemheading2 ? <strong><Text data={text2 ? text2 : itemheading2 ? itemheading2 : null} /></strong> : null }
                                                </p>
                                                {caption2 || itembody2 ? <p className="c-paragraph-4"><Text data={caption2 ? caption2 : itembody2 ? itembody2 : null} /></p> : null }
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            {button ? <Button data={this.props.data.button} style={btnStyle}/> : null }
                            {legalText ? <p className="c-paragraph-4"><Text data={legalText} /></p> : null }
                        </div>
                    </div>
                </div>
            )
        }
    }
}

export default LegacyKSP