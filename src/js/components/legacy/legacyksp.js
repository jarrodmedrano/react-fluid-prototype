import React from 'react';
import classNames from 'classnames';
import Heading from '../heading/Heading';
import './legacy.scss!';
import Picture from '../picture/Picture';

class LegacyKSP extends React.Component {
    render() {
        {/* 
            This component renders ksp
            Perhaps clone with an external switch to handle the 'reversed' and 'rs' variants
        */ }

        let { style, textSide, header, logo, text1, text2, caption1, caption2, icon1, icon2, media, button, legalText } = this.props.data;

        // alignX, alignY, and theme need to be assumed in the css since they will not be available in the data
        let templateClass = classNames('m-hero-item f-medium context-accessory');

        {/*
            'style' was included to adjust local values.  We may need to inventory to see what has been used here.

            icon* is optional
            *2 values are optional
            media is optional
            button is optional

            if media != null
            media.blockType will be "video" or "img" or "gif"
            media.src will contain the relative uri

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
            <div className={templateClass}>
                <div>
                    {/* (logo) ? <img class="logo" src={logo} /> : null */}
                    <h1>{header}</h1>
                    <p>{text1}</p>
                    {/* (button)?<a href={button.link}><button type="submit">{button.text}</button></a>: null */}
                </div>
            </div>
        )
    }
}

export default LegacyKSP