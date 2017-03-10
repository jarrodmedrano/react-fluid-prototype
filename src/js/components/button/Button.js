import React from 'react'
import propsAreValid from '../../lib/util';
import dataPropTypes, {buttonPropTypes, buttonInterface} from '../../../data/dataProps';
import ButtonLink from '../link/ButtonLink';

class Button extends React.Component {

    render() {
        if(propsAreValid(this.props.data, this)) {
            let { text, link, toPage, ariaLabel, textColor, backgroundColor, buttonText } = this.props.data;
            let btnStyle = {
                color: textColor,
                background: backgroundColor
            };
            return (
                <div>
                    <ButtonLink to={toPage || link} className="c-call-to-action c-glyph" aria-label={ariaLabel} style={this.props.style || btnStyle} children={text || buttonText} />
                </div>
            )
        } return null
    }
}

Button.propTypes = dataPropTypes(buttonPropTypes);

export default Button
