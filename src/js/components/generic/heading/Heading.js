import React from 'react';
import Button from '../../generic/button/Button';
import Text from '../text/Text';
import Picture from '../picture/Picture';
import Video from '../../generic/video/Video';
import classNames from 'classnames';
import propsAreValid from '../../../lib/util';
import dataPropTypes, {headingPropTypes} from '../../../../data/dataProps';

class Heading extends React.Component {
    render() {
        if(propsAreValid(this.props.data, this)) {
            let {heading, subheading, paragraph, legalText, button, badge, alignX, alignY} = this.props.data;
            let {iHero} = this.props || false;
            let justifyClass = classNames(alignX ? `x-type-${alignX}` : '', alignY ? `x-type-${alignY}` : '');

            let picturePlacement = this.props.data.picturePlacement || 'first';

            return (
            <div>
                {/* alignY this is for placement of foreground images, it comes from parent component not from data */}
                {picturePlacement === 'first' && iHero ? <div className="hero-media">{renderMedia(this.props)}</div> : null}
                <div className={`content-animate ${justifyClass}`}>
                    {picturePlacement === 'first' && !iHero ? renderMedia(this.props) : null}
                    {badge ? renderBadgeText(badge) : null }
                    {heading ? renderMainHeading(heading) : null }
                    {picturePlacement === 'second' && !iHero ? renderMedia(this.props) : null}
                    {subheading ? renderSubHeading(subheading) : null }
                    {paragraph ? renderPText(paragraph) : null }
                    {picturePlacement === 'third' && !iHero ? renderMedia(this.props) : null}
                    {button && !button.alignY ? <Button data={button} /> : null }
                    {legalText ? renderLegalText(legalText) : null }
                </div>
                {picturePlacement === 'second' && iHero ? <div className="hero-media">{renderMedia(this.props)}</div> : null}
                {button && button.alignY ? <Button data={button} /> : null }
            </div>
            )
        } return null
    }
}

const renderLegalText = (props) => {
    return (
        <p className="c-paragraph-4"><Text data={props} /></p>
    )
};

const renderPText = (props) => {
    return (
        <p className="c-paragraph"><Text data={props} /></p>
    )
};

const renderBadgeText = (props) => {
    return (
        <strong className="c-badge f-large f-highlight"><Text data={props} /></strong>
    )
};

const renderMainHeading = (props) => {
    return (
        <h1 className="c-heading"><Text data={props} /></h1>
    )
};

const renderSubHeading = (props) => {
    return (
        <p className="c-subheading"><Text data={props} /></p>
    )
};

const renderMedia = (props) => {
    const {media} = props.data;
    const {videoBlock, pictureBlock} = media || props.data;

    if (videoBlock) {
        return (
            <Video active={props.active} data={videoBlock}/>
        )
    } else if (pictureBlock) {
        return (
            <Picture data={pictureBlock}/>
        )
    }
};

Heading.propTypes = dataPropTypes(headingPropTypes);

export default Heading