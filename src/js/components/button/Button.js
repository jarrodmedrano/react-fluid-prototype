import React from 'react'

class Button extends React.Component {

    render() {
        if (this.props.data) {

            let { title, path, ariaLabel, textColor, backgroundColor } = this.props.data.button;

            let btnStyle = {
                background: backgroundColor,
                color: textColor
            };

            return (
                <div><a href={path} className="c-call-to-action c-glyph" aria-label={ariaLabel} style={btnStyle}><span>{title}</span></a></div>
            )
        }
        else {
            return (null);
        }
    }
}

export default Button
