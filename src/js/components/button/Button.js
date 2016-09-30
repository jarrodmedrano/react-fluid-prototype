import React from 'react'
import { Link } from 'react-router';

class Button extends React.Component {
    render() {
        if (this.props.data) {
            let { title, path, ariaLabel, textColor, backgroundColor, hash } = this.props.data;

            {/*TODO: Adjust style according to data*/ }
            return (
                <Link to={path} hash={hash} className="c-button c-button-primary" >{title}</Link>
            )
        }
        else {
            return (null);
        }
    }
}

export default Button
