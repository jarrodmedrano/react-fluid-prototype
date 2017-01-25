import React from 'react';
import './button-link.scss!';
import propsAreValid, {onClickHandler} from '../../lib/util';
import {linkPropTypes} from '../../../data/dataProps';
import {Link, Element, Events, scroll, scrollSpy, _handleSetActive} from '../../lib/scroll';
import {Link as RouterLink} from 'react-router'


class ButtonLink extends React.Component {
    componentDidMount() {
        Events.scrollEvent.register('begin', function(to, element) {
        });
        Events.scrollEvent.register('end', function(to, element) {
        });
        scrollSpy.update();

    }

    componentWillUnmount() {
        Events.scrollEvent.remove('begin');
        Events.scrollEvent.remove('end');
    }

    _parseTo(to) {
        let parser = document.createElement('a');
        parser.href = to;
        return parser;
    }

    _isInternal(to) {
        // If it's a relative url such as '/path', 'path' and does not contain a protocol we can assume it is internal.
        if(to.indexOf("://")=== -1) return true;
        const toLocation = this._parseTo(to);
        return window.location.hostname === toLocation.hostname;
    }

    _isHash(to) {
        if(to.indexOf("#/")=== -1) return true;
        const toLocation = this._parseTo(to);
        return window.location.hostname === toLocation.hostname;
    }

    render() {
        if(propsAreValid(this.props)) {
            const {to, children, ...rest} = this.props;
            const _isInternal = this._isInternal(to);
            const _isHash = this._isHash(to);

            if (_isInternal) {
                return (
                    <Link className="c-action-trigger" activeClass="active" to={to} {...rest} spy={true} smooth={true} duration={500} isDynamic={true}>{children}</Link>
                );
            } else {
                return (<a href={to} {...rest} onClick={onClickHandler}>{children}</a>);
            }
        } return null
    }
}

ButtonLink.defaultProps = {
    to: '',
    children: ''
};

ButtonLink.propTypes = linkPropTypes;

export default ButtonLink;