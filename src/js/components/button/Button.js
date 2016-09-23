import React from 'react'
import { Link } from 'react-router';


class Button extends React.Component {

    render() {
        return (
            <Link to={this.props.pathname} hash={this.props.hash} className="c-button c-button-primary" >{this.props.title}</Link>
        )
    }
}

export default Button
