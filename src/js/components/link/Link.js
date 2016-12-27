import React from 'react';
import {Link as ReactLink} from 'react-router';
import onClickHandler from '../../telemetry';

export default class Link extends React.Component {

    parseTo(to) {

        let parser = document.createElement('a');
        parser.href = to;
        return parser;

    }

    isInternal(to) {

        // If it's a relative url such as '/path', 'path' and does not contain a protocol we can assume it is internal.

        if(to.indexOf("://")=== -1) return true;

        const toLocation = this.parseTo(to);
        return window.location.hostname === toLocation.hostname;

    }

    render() {

        const {to, children, ...rest} = this.props;
        const isInternal = this.isInternal(to);

        if (isInternal) {
            return (<ReactLink to={to} {...rest}>{children}</ReactLink>);
        } else {
            return (<a href={to} {...rest} onClick={onClickHandler}>{children}</a>);
        }

    }
}