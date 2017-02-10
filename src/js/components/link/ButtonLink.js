import React from 'react';
import classNames from 'classnames';
import './button-link.scss!';
import propsAreValid, {onClickHandler} from '../../lib/util';
import {linkPropTypes} from '../../../data/dataProps';
import {Link, Element, Events, scroll, scrollSpy, _handleSetActive} from '../../lib/scroll';
import {Link as RouterLink} from 'react-router';
import sanitizeHtml from 'sanitize-html';
import LegacyCenteredBackdrop from '../legacy/legacycenteredbackdrop';

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
            allowedTags: [],
            allowedAttributes: []
        });
    }


    render() {

        if(propsAreValid(this.props)) {

            const {to, children, ...rest} = this.props;
            const _isInternal = this._isInternal(to);
            var templateClass = classNames('c-action-trigger');

            if(this.props.icon) {
                let anchorIconFont = this.props.icon;
                templateClass = classNames(`${anchorIconFont}`, `c-action-trigger c-glyph mdl-glyph`);
            }

            if (_isInternal) {
                if(this.props.layout === 'down-arrow') {
                    return (
                        <div className="down-arrow">
                            <Link className={templateClass} activeClass="active" to={to} {...rest} spy={true} smooth={true} duration={500} isDynamic={true} />
                        </div>
                    );
                } else if(this.props.layout === 'mosaic') {
                    return (
                        <Link className={templateClass} activeClass="active" to={to} {...rest} spy={true} smooth={true} duration={500} isDynamic={true}>{children}</Link>
                    )
                } else {
                    return (
                        <Link className={templateClass} activeClass="active" to={to} {...rest} spy={true} smooth={true} duration={500} isDynamic={true} dangerouslySetInnerHTML={{ __html: this.cleanHtml(children) }} />
                    );
                }
            } else {
                if(this.props.layout === 'mosaic') {
                    return (<a href={to} {...rest} onClick={onClickHandler}>{children}</a>);
                } else {
                    return (<a href={to} {...rest} onClick={onClickHandler} dangerouslySetInnerHTML={{ __html: this.cleanHtml(children) }} />);
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