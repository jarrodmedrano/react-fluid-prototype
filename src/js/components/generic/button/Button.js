import React from 'react'
import propsAreValid from '../../../lib/util';
import dataPropTypes, {buttonPropTypes} from '../../../../data/dataProps';
import ButtonLink from '../link/ButtonLink';
import Text from '../text/Text';

class Button extends React.Component {

    _stopPropagation(e) {
        e.preventDefault();
        return false;
    }

    shouldComponentUpdate(nextProps) {
        if(this.props.data !== nextProps.data) {
            return true;
        }
        return false;
    }

    render() {
        if (propsAreValid(this.props.data, this)) {
            let {text, link, toPage, ariaLabel, textColor, backgroundColor, buttonText, alignY} = this.props.data;

            let btnStyle = {
                color: textColor,
                background: backgroundColor
            };

            if (text || buttonText) {
                if (this.props.nobutton) {
                    return (
                        <div>
                            <a className="c-call-to-action c-glyph" aria-label={ariaLabel}
                               style={this.props.style || btnStyle}
                               onClick={(e) => this._stopPropagation(e)}><Text data={text || buttonText} /></a>
                        </div>
                    )
                }

                return (
                    <div>
                        <ButtonLink to={toPage || link} className="c-call-to-action c-glyph" aria-label={ariaLabel}
                                    style={this.props.style || btnStyle} children={text || buttonText}/>
                    </div>
                )
            }
        }
        return null
    }
}

Button.propTypes = dataPropTypes(buttonPropTypes);

export default Button
