import React from 'react'
import propsAreValid from '../../util';
import buttonPropTypes from '../../../data/dataProps';
import dataPropTypes from '../../../data/dataProps';
import Link from '../link/Link';

class Button extends React.Component {
    render() {
        if(propsAreValid(this.props.data.button)) {
            let { anchorTitle, path, ariaLabel, textColor, backgroundColor } = this.props.data.button;
            let btnStyle = {
                background: backgroundColor,
                color: textColor
            };
            return (
                <div>
                    <Link to={path} className="c-call-to-action c-glyph" aria-label={ariaLabel} style={btnStyle} children={anchorTitle} />
                </div>
            )
        } return null
    }
}

Button.propTypes = dataPropTypes(buttonPropTypes);

export default Button
