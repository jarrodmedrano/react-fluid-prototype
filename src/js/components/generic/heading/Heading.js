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
            let {heading, subheading, paragraph, legalText, button, badge, alignX, alignY, pictureBlock, picturePlacement, videoBlock} = this.props.data;
            let {iHero} = this.props;
            let justifyClass = classNames(alignX ? `x-type-${alignX}` : '', alignY ? `x-type-${alignY}` : '');

            return (
            <div>
                {/* alignY this is for placement of foreground images, it comes from parent component not from data */}
                {pictureBlock && picturePlacement !== 'second' && picturePlacement !== 'third' && iHero ? <div className="hero-media">{renderMedia(this.props)}</div> : null}
                <div className={`content-animate ${justifyClass}`}>
                    {pictureBlock && picturePlacement !== 'second' && picturePlacement !== 'third' && !iHero ? renderMedia(this.props) : null}
                    {badge ? <strong className="c-badge f-large f-highlight"><Text data={badge} /></strong> : null }
                    {heading ? <h1 className="c-heading"><Text data={heading} /></h1> : null }
                    {pictureBlock && picturePlacement === 'second' && !iHero ? renderMedia(this.props) : null}
                    {subheading ? <p className="c-subheading"><Text data={subheading} /></p> : null }
                    {paragraph ? <p className="c-paragraph"><Text data={paragraph} /></p> : null }
                    {pictureBlock && picturePlacement === 'third' && !iHero ? renderMedia(this.props) : null}
                    {button && !button.alignY ? <Button data={button} /> : null }
                    {legalText ? <p className="c-paragraph-4"><Text data={legalText} /></p> : null }
                </div>
                {pictureBlock && picturePlacement === 'second' && iHero ? <div className="hero-media">{renderMedia(this.props)}</div> : null}
                {button && button.alignY ? <Button data={button} /> : null }
            </div>
            )
        } return null
    }
}

const renderMedia = (props) => {
    const {media} = props.data;
    const {videoBlock, pictureBlock} = media || props.data;
    console.log(props);

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