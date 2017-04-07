import React from 'react';
import classNames from 'classnames';
import {Link} from 'react-router';
import './button-link.scss!';
import propsAreValid, {externalNavigate} from '../../lib/util';
import {linkPropTypes} from '../../../data/dataProps';
import sanitizeHtml from 'sanitize-html';
import appHistory from '../../app';

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
            allowedTags: ['b', 'i', 'em', 'strong', 'a', 'span', 'br', 'sup'],
            allowedAttributes: {
                'a': ['href', 'style'],
                'span': ['style'],
                'b': ['style'],
                'p': ['style']
            }
        });
    }

    _handleClick(target, internal) {
        if(internal) {
            if(target.indexOf("#")=== -1) {
                appHistory.push(target);
            } else {
                appHistory.push(target);

                setTimeout(() => {
                    const id = target.split('#')[1];
                    const element = document.getElementById(id);
                    if (element) element.scrollIntoView();
                }, 0);
            }
        } else {
            externalNavigate(target);
        }
    }

    render() {
        if(propsAreValid(this.props, this)) {
            const {to, children, layout, ...rest} = this.props;
            const _isInternal = this._isInternal(to);
            let templateClass = classNames('c-action-trigger');

            if (_isInternal) {
                if(layout === 'mosaic') {
                    return (
                        <Link className={templateClass} to={to} {...rest} onClick={(e) => {e.preventDefault(); this._handleClick(to, true)}} draggable="false">{children}</Link>
                    )
                } else {
                    return (
                        <Link className={templateClass} to={to} {...rest} onClick={(e) => {e.preventDefault(); this._handleClick(to, true)}} dangerouslySetInnerHTML={{ __html: this.cleanHtml(children) }} draggable="false"  />
                    );
                }
            } else {
                if(layout === 'mosaic') {
                    return (<a href={to} {...rest} onClick={(e) => {e.preventDefault(); this._handleClick(to, false)}} draggable="false">{children}</a>);
                } else {
                    return (<a href={to} {...rest} onClick={(e) => {e.preventDefault(); this._handleClick(to, false)}} dangerouslySetInnerHTML={{ __html: this.cleanHtml(children) }} draggable="false" />);
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