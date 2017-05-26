import React from 'react';
import classNames from 'classnames';
import Heading from '../../../../generic/heading/Heading';
import Picture from '../../../../generic/picture/Picture';
import Video from '../../../../generic/video/Video';
import Price from '../../../../generic/price/Price';
import Text from '../../../../generic/text/Text';
import Button from '../../../../generic/button/Button';
import GenericList from '../../../../generic/list/GenericList';
import propsAreValid from '../../../../../lib/util';
import dataPropTypes, {heroPropTypes} from '../../../../../../data/dataProps';

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

            if (type === 'immersiveHero') {
                return (
                    <div className={heroClass}>
                        {pictureBlock ?
                            <Heading data={headingBlock} iHero="true" />
                        : null }
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
            else if (type === 'facts') {
                let heroClassCard = classNames(heroClass, 'm-highlight-feature fact-tag');
                let {heading, subheading, paragraph, button, badge} = this.props.data.headingBlock;
                let {ScreenSize, ProcessorDescription, Memory, StorageDescription} = this.props.deviceInfo;

                let specs = [ScreenSize, ProcessorDescription, Memory, StorageDescription];

                return (
                    <div data-grid="col-12" className={heroClassCard}>
                        <Picture data={pictureBlock}/>
                        <div>
                            <div>
                                {/*{picture && alignY === 'bottom' ? <Picture data={picture} /> : null }*/}
                                <div className="content-animate">
                                    {badge ? <strong className="c-badge f-large f-highlight"><Text data={badge} /></strong> : null }
                                    {heading ? <h1 className="c-heading"><Text data={heading} /></h1> : null }
                                    {subheading ? <p className="c-subheading"><Text data={subheading} /></p> : null }
                                    {paragraph ? <p className="c-paragraph"><Text data={paragraph} /></p> : null }
                                    <GenericList data={specs} />
                                    <Price data={this.props.deviceInfo} />
                                    {button ? <Button data={button} /> : null }
                                </div>
                                {/*{picture && alignY === 'top' ? <Picture data={picture} /> : null }*/}
                            </div>
                        </div>
                    </div>
                )
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