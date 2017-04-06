import React from 'react';
import classNames from 'classnames';
import Heading from '../../../../../generic/heading/Heading';
import './Hero.scss!';
import './immersiveHero.scss!';
import Picture from '../../../../../generic/picture/Picture';
import Video from '../../../../../generic/video/Video';
import propsAreValid from '../../../../../../lib/util';
import dataPropTypes, {heroPropTypes} from '../../../../../../../data/dataProps';

class Hero extends React.Component {
    render() {
        if (propsAreValid(this.props.data, this)) {
            let {alignX, alignY, theme, type, media, pictureBlock, headingBlock, viewMask} = this.props.data;
            let heroClass = classNames(
                alignX ? `f-x-${alignX}` : null,
                alignX ? `f-align-${alignX}` : null,
                alignY ? `f-y-${alignY}` : null,
                alignY ? `f-align-${alignY}` : null,
                theme ? theme : 'theme-light',
                type === 'immersiveHero' ? `m-immersive-hero-item` : type ? `m-${type}-item` : 'm-hero-item',
                viewMask ? `f-mask-${viewMask}` : null);

            if (type === 'immersiveHero' && alignY) {
                return (
                    <div className={heroClass}>
                        {pictureBlock && alignY === 'top' ? <Picture data={pictureBlock} /> : null}
                            <Heading data={headingBlock} />
                        {pictureBlock && alignY === 'bottom' ? <Picture data={pictureBlock} /> : null}
                    </div>
                )
            }
            else if (type === 'fullscreen') {
                let heroClassFScreen = classNames(heroClass, 'm-image-intro f-transparent');
                if (media) {
                    let {videoBlock, pictureBlock} = media;
                    if(videoBlock) {
                        return (
                            <div>
                                <Video active={this.props.active} data={videoBlock} className="video-fullscreen fixed" />
                            </div>
                        )
                    }
                    else if(pictureBlock){
                        return (
                            <div className={heroClassFScreen}>
                                <Picture data={pictureBlock}/>
                                {headingBlock ? <Heading data={headingBlock}/> : null }
                            </div>
                        )
                    }
                }
            }
            else if (type === 'card') {
                let heroClassCard = classNames(heroClass, 'm-highlight-feature');
                return (
                    <div data-grid="col-12" className={heroClassCard}>
                        <Picture data={pictureBlock}/>
                        <div>
                            <Heading data={headingBlock}/>
                        </div>
                    </div>
                )
            } else {
                return (
                    <div className={heroClass}>
                        <Picture data={pictureBlock}/>
                        <Heading data={headingBlock}/>
                    </div>
                )
            }
        }
        return null
    }
}

Hero.propTypes = dataPropTypes(heroPropTypes);

export default Hero