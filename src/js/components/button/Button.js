import React from 'react'
import propsAreValid from '../../lib/util';
import dataPropTypes, {buttonPropTypes, buttonInterface} from '../../../data/dataProps';
import ButtonLink from '../link/ButtonLink';

class Button extends React.Component {
    render() {
        if(propsAreValid(this.props.data.button, buttonInterface)) {
            let { buttonText, path, ariaLabel, textColor } = this.props.data.button;
            let btnStyle = {
                color: textColor
            };
            return (
                <div>
                    <ButtonLink to={path} className="c-call-to-action c-glyph" aria-label={ariaLabel} style={btnStyle} children={buttonText}  />
                </div>
            )
        } return null
    }
}

Button.propTypes = dataPropTypes(buttonPropTypes);

export default Button
