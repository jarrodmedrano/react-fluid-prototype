import React from 'react';
import classNames from 'classnames';
import './button-link.scss!';
import propsAreValid, {navigateEvent} from '../../lib/util';
import {linkPropTypes} from '../../../data/dataProps';
import {Link} from '../../lib/scroll';

class FooterLink extends React.Component {
    render() {
        if(propsAreValid(this.props, this)) {
            const {to, children, iconFont, icon, groupIdentifier, ...rest} = this.props;
            let templateClass = classNames('c-action-trigger');

            //If there's no icon glyph, or if there are both icon and icon glyph, use the icon image. Else just use the icon glyph
            if(!iconFont || iconFont && icon) {
                templateClass = classNames('icon-img c-action-trigger c-glyph mdl-glyph');
            } else {
                templateClass = classNames(`${iconFont}`, `c-action-trigger c-glyph mdl-glyph`);
            }

            return (
                <Link className={templateClass} activeClass="active" to={to} {...rest}  spy={true} smooth={true} duration={500} isDynamic={true} icon={icon}  onClick={() => {navigateEvent(groupIdentifier, to, 'Footer Link ' + children)}} >{children}</Link>
            );
        } return null
    }
}

FooterLink.defaultProps = {
    to: '',
    children: ''
};

FooterLink.propTypes = linkPropTypes;

export default FooterLink;