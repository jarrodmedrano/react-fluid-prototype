import React from 'react';
import classNames from 'classnames';
import Heading from '../heading/Heading';
import './Hero.scss!';
import Picture from '../picture/Picture';
import Video from '../video/Video';
import propsAreValid from '../../lib/util';
import dataPropTypes, {heroPropTypes} from '../../../data/dataProps';

class Hero extends React.Component {
    render() {
        if (propsAreValid(this.props.data, this)) {
            let {alignX, alignY, theme, type, media, pictureBlock, headingBlock} = this.props.data;
            let heroClass = classNames(
                alignX ? `f-x-${alignX}` : 'f-x-center',
                alignX ? `f-align-${alignX}` : 'f-align-center',
                alignY ? `f-y-${alignY}` : 'f-y-center',
                alignY ? `f-align-${alignY}` : 'f-align-top',
                theme ? theme : 'theme-light',
                type === 'immersiveHero' ? `m-immersive-hero-item` : type ? `m-${type}-item` : 'm-hero-item');
            if (type === 'immersiveHero' && alignY) {
                return (
                    <div className={heroClass}>
                        <div>
                            <Heading data={headingBlock} picture={pictureBlock} alignY={alignY} />
                        </div>
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