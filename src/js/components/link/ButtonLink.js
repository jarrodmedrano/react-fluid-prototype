import React from 'react';
import classNames from 'classnames';
import {Link} from 'react-router';
import './button-link.scss!';
import propsAreValid, {externalNavigate, internalNavigate} from '../../lib/util';
import {linkPropTypes} from '../../../data/dataProps';
import sanitizeHtml from 'sanitize-html';


class ButtonLink extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            internal: false,
            mosaic: false
        }
    }

    componentWillMount() {
        if (this._isInternal(this.props.to)) {
            this.setState({
                internal: true
            })
        }

        if (this.props.layout && this.props.layout === 'mosaic') {
            this.setState({
                mosaic: true
            })
        }
    }

    _isInternal(to) {
        // If it's a relative url such as '/path', 'path' and does not contain a protocol we can assume it is internal.
        if (to.indexOf("://") === -1 && to.indexOf("ms-") === -1) return true;
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
        if (internal) {
            internalNavigate(target);
        } else {
            externalNavigate(target);
        }
    }

    _buildLink() {
        const {to, children, ...rest} = this.props;

        let linkProps = {
            onClick: (e) => {
                e.preventDefault();
                this._handleClick(to, this.state.internal)
            },
            draggable: 'false',
        };

        const linkElement = React.createElement(
            'a',
            {
                ...linkProps,
                to: to,
                href: to,
                ...rest,
                dangerouslySetInnerHTML: {__html: this.cleanHtml(children)}
            }
        );

        const mosaicLinkElement = React.createElement(
            'a',
            {
                ...linkProps,
                to: to,
                href: to,
                className: 'mosaic-link'
            },
            children
        );

        if(this.state.mosaic === true) {
            return mosaicLinkElement
        } else {
            return linkElement
        }
    }

    render() {
        if (propsAreValid(this.props, this)) {
            return this._buildLink();
        }
        return null
    }
}

ButtonLink.defaultProps = {
    to: '',
    children: ''
};

ButtonLink.propTypes = linkPropTypes;

export default ButtonLink;