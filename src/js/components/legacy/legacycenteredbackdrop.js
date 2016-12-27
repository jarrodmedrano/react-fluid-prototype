import React from 'react';
import classNames from 'classnames';
import Heading from '../heading/Heading';
import './legacy.scss!';
import Picture from '../picture/Picture';

class LegacyCenteredBackdrop extends React.Component {
    render() {
        {/* 
            This component renders ksp
            Perhaps clone with an external switch to handle the 'reversed' and 'rs' variants
        */ }

        let { cardColor, cardBackground, cardThemeColor, cardButtonBackground, CardButtonHoverBackground, cardThemeFont} = this.props.data;
        let { header, subheader, button, legalText } = this.props.data;

        // alignX, alignY, and theme need to be assumed in the css since they will not be available in the data
        let templateClass = classNames('m-hero-item f-medium context-accessory');

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
            <div className={templateClass}>
                <div>
                    <h1>{header}</h1>
                    <p>{subheader}</p>
                    {/* (button)?<a href={button.link}><button type="submit">{button.text}</button></a>: null */}
                </div>
            </div>
        )
    }
}

export default LegacyCenteredBackdrop