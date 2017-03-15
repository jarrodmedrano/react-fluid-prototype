import React from 'react';
import classNames from 'classnames';
import './button-link.scss!';
import propsAreValid, {externalNavigate} from '../../lib/util';
import {linkPropTypes} from '../../../data/dataProps';
import {Link, Element, Events, scroll, scrollSpy, _handleSetActive} from '../../lib/scroll';
import {Link as RouterLink} from 'react-router';
import sanitizeHtml from 'sanitize-html';

class ButtonLink extends React.Component {

    _parseTo(to) {
        let parser = document.createElement('a');
        parser.href = to;
        return parser;
    }

    _isInternal(to) {
        // If it's a relative url such as '/path', 'path' and does not contain a protocol we can assume it is internal.
        if(to.indexOf("://")=== -1 && to.indexOf("ms-")=== -1) return true;
        const toLocation = this._parseTo(to);
        return window.location.hostname === toLocation.hostname;
    }

    cleanHtml(dirty) {
        return sanitizeHtml(dirty, {
            allowedTags: ['b', 'i', 'em', 'strong', 'a', 'span'],
            allowedAttributes: {
                'a': ['href', 'style'],
                'span': ['style'],
                'b': ['style'],
                'p': ['style']
            }
        });
    }

    render() {
        if(propsAreValid(this.props, this)) {
            const {to, children, iconFont, layout, icon, ...rest} = this.props;
            const _isInternal = this._isInternal(to);
            let templateClass = classNames('c-action-trigger');

            if (_isInternal) {
                if(layout === 'mosaic') {
                    return (
                        <Link className={templateClass} activeClass="active" to={to} {...rest} spy={true} smooth={true} duration={500} isDynamic={true} draggable="false" />
                    )
                } else {
                    return (
                        <Link className={templateClass} activeClass="active" to={to} {...rest} spy={true} smooth={true} duration={500} isDynamic={true} dangerouslySetInnerHTML={{ __html: this.cleanHtml(children) }} draggable="false" />
                    );
                }
            } else {
                if(layout === 'mosaic') {
                    return (<a href={to} {...rest} onClick={externalNavigate} draggable="false">{children}</a>);
                } else {
                    return (<a href={to} {...rest} onClick={externalNavigate} dangerouslySetInnerHTML={{ __html: this.cleanHtml(children) }} draggable="false" />);
                }
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