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
            let {heading, subheading, paragraph, legalText, button, badge, alignX} = this.props.data;
            let {iHero, alignY} = this.props || false;
            let justifyClass = classNames(alignX ? `x-type-${alignX}` : '', legalText ? 'has-legal-text' : '');
            let picturePlacement = this.props.data.picturePlacement || 'first';

            return (
            <div>
                {/* alignY this is for placement of foreground images, it comes from parent component not from data */}
                {alignY !== 'top' && iHero ?
                    <div className="hero-media">
                        {renderMedia(this.props)}
                    </div>
                : null}
                <div className={`content-animate ${justifyClass}`}>
                    {picturePlacement === 'first' && !iHero ? renderMedia(this.props) : null}
                    {badge ? renderBadgeText(badge) : null }
                    {renderMainHeading(heading)}
                    {picturePlacement === 'second' && !iHero ? renderMedia(this.props) : null}
                    {renderSubHeading(subheading)}
                    {renderPText(paragraph)}
                    {picturePlacement === 'third' && !iHero ? renderMedia(this.props) : null}
                    {button ? renderButton(this.props) : null}
                    {legalText ? renderLegalText(legalText) : null }
                </div>
                {alignY === 'top' && iHero ?
                    <div className="hero-media">
                    {renderMedia(this.props)}
                    </div>
                : null}
            </div>
            )
        } return null
    }
}

const renderButton = (props) => {
    let {nobutton} = props;
    let {button} = props.data;

    if(props) {
        return (
            !nobutton ? <Button data={button} /> : <Button data={button} nobutton />
        )
    }
}


const renderLegalText = (props) => {
    if(props) {
        return (
            <p className="c-caption-1 legal"><small><Text data={props}/></small></p>
        )
    }
};

const renderPText = (props) => {
    if(props) {
        return (
            <p className="c-paragraph"><Text data={props}/></p>
        )
    }
};

const renderBadgeText = (props) => {
    if(props) {
        return (
            <strong className="c-badge f-large f-highlight"><Text data={props}/></strong>
        )
    }
};

const renderMainHeading = (props) => {
    if(props) {
        return (
            <h1 className="c-heading"><Text data={props}/></h1>
        )
    }
};

const renderSubHeading = (props) => {
    if(props) {
        return (
            <p className="c-subheading"><Text data={props}/></p>
        )
    }
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