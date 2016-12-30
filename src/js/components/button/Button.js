import React from 'react'
import propsAreValid from '../../util';
import dataPropTypes, {buttonPropTypes, buttonInterface} from '../../../data/dataProps';
import Link from '../link/Link';

class Button extends React.Component {
    render() {
        if(propsAreValid(this.props.data.button, buttonInterface)) {
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
