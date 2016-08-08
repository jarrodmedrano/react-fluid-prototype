import React from 'react'

class Button extends React.Component {

    render() {
        return (
            <a href={ this.props.data.ctaUrl } role="button" className="c-button c-button-primary" id="anchor7">{ this.props.data.ctaText }</a>
        )
    }
}

export default Button
