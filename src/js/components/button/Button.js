import React from 'react'
import propsAreValid from '../../lib/util';
import dataPropTypes, {buttonPropTypes, buttonInterface} from '../../../data/dataProps';
import ButtonLink from '../link/ButtonLink';

class Button extends React.Component {

    render() {
        if(propsAreValid(this.props.data.button) && propsAreValid(this.props.data.button.link)) {
            let { text, link, ariaLabel, textColor, backgroundColor } = this.props.data.button;
            let btnStyle = {
                color: textColor,
                background: backgroundColor
            };
            return (
                <div>
                    <ButtonLink to={link} className="c-call-to-action c-glyph" aria-label={ariaLabel} style={btnStyle} children={text}  />
                </div>
            )
        } return null
    }
}

Button.propTypes = dataPropTypes(buttonPropTypes);

export default Button
