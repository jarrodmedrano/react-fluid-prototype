import React from 'react';
import classNames from 'classnames';
import Heading from '../../../../generic/heading/Heading';
import Picture from '../../../../generic/picture/Picture';
import Video from '../../../../generic/video/Video';
import LegalText from '../../../../generic/legal/Legal';
import propsAreValid from '../../../../../lib/util';
import dataPropTypes, {heroPropTypes} from '../../../../../../data/dataProps';

class Hero extends React.Component {
    render() {
        if (propsAreValid(this.props.data, this)) {
            const {alignX, alignY, theme, type, viewMask} = this.props.data;

            let iHero = false;

            if(type === 'immersiveHero') {
                iHero = true;
            }

            const heroClass = classNames(
                alignX ? `f-x-${alignX}` : '',
                alignX ? `f-align-${alignX}` : '',
                alignY ? `f-y-${alignY}` : '',
                alignY ? `f-align-${alignY}` : '',
                theme ? theme : 'theme-light',
                type === 'immersiveHero' ? `m-immersive-hero-item` : type ? `m-${type}-item` : 'm-hero-item',
                viewMask ? `f-mask-${viewMask}` : '');

            if (type === 'card') {
                const heroClassCard = classNames(heroClass, 'm-highlight-feature');
                return (
                    <div data-grid="col-12" className={heroClassCard}>
                        {renderMedia(this.props)}
                        <div>
                            {renderHeading(this.props)}
                            {renderLegal(this.props)}
                        </div>
                    </div>
                )
            } else {
                return (
                    <div className={heroClass}>
                        {renderMedia(this.props)}
                        {renderHeading(this.props, iHero)}
                        {renderLegal(this.props)}
                    </div>
                )
            }
        }
        return null
    }
}

const renderLegal = (props) => {
    const {legalText} = props.data;
    if(legalText) {
        return (
            <LegalText data={legalText} />
        )
    }
};

const renderHeading = (props, iHero) => {
    const {headingBlock, alignY} = props.data;
    if(headingBlock) {
        return (
            <Heading data={headingBlock} alignY={alignY} iHero={iHero} active={props.active} />
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

Hero.propTypes = dataPropTypes(heroPropTypes);

export default Hero