import React from 'react';
import propsAreValid from '../../util';
import onClickHandler from '../../telemetry';
import {linkPropTypes} from '../../../data/dataProps';

class Link extends React.Component {
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

    render() {
        if(propsAreValid(this.props)) {
            const {to, children, ...rest} = this.props;
            const _isInternal = this._isInternal(to);
            if (_isInternal) {
                return (<a href={to} {...rest}>{children}</a>);
            } else {
                return (<a href={to} {...rest} onClick={onClickHandler}>{children}</a>);
            }
        } return null
    }
}

Link.propTypes = linkPropTypes;

export default Link;