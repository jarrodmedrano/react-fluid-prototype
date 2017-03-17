import React from 'react';
import classNames from 'classnames';
import propsAreValid, {externalNavigate} from '../../lib/util';
import './down-arrow.scss!';
import {linkPropTypes} from '../../../data/dataProps';
import {Link, Element, Events, scroll, scrollSpy} from '../../lib/scroll';
import {Link as RouterLink} from 'react-router';

class DownArrow extends React.Component {

    render() {
        if(propsAreValid(this.props.data, this)) {
            const {to, children, ...rest} = this.props;

            return (
                <div className="down-arrow">
                    <Link className="c-flipper f-next f-large" activeClass="active" to={to} {...rest} spy={true} smooth={true} duration={500} isDynamic={true} />
                </div>
            );
        } return null
    }
}

DownArrow.defaultProps = {
    to: '',
    children: ''
};

DownArrow.propTypes = linkPropTypes;

export default DownArrow;