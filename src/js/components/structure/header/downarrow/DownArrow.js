import React from 'react';
import propsAreValid from '../../../../lib/util';
import {linkPropTypes} from '../../../../../data/dataProps';
import {Link} from '../../../../lib/scroll';

class DownArrow extends React.Component {
    render() {
        if(propsAreValid(this.props.data, this)) {
            const {to, ...rest} = this.props;
            if(this.props.data >= 2) {
                return (
                    <div className="down-arrow">
                        <Link className="c-flipper f-next f-large" activeClass="active" to={to} {...rest} spy={true} smooth={true} duration={500} isDynamic={true} />
                    </div>
                );
            }
        } return null
    }
}

DownArrow.defaultProps = {
    to: '',
    children: ''
};

DownArrow.propTypes = linkPropTypes;

export default DownArrow;