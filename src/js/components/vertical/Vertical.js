import React from 'react'
import classNames from 'classnames';
import Parallax from './parallax/Parallax';
import Video from './video/Video';
import Apps from './apps/Apps';
import Config from './config/Config';
import Hero from '../hero/Hero';
import ImmersiveHero from '../hero/ImmersiveHero';
import MosaicContainer from '../mosaic/MosaicContainer';

class Vertical extends React.Component {

    render() {

        let verticalClass = classNames('scene-vertical', this.props.vertical.groupIdentifier);

        let layout = this.props.vertical.layout;

        return (
            <section className={verticalClass}  id={this.props.vertical.title.split(' ').join('-').toLowerCase()}>
                {layout === 'hero' ?
                    <Hero data={this.props.vertical} /> : null
                }
                {layout === 'immersive-hero' ?
                    <ImmersiveHero data={this.props.vertical} /> : null
                }
                {layout === 'parallax' ?
                    <Parallax data={this.props.vertical} /> : null
                }
                {layout === 'video' ?
                    <Video data={this.props.vertical} /> : null
                }
                {layout === 'apps' ?
                    <Apps data={this.props.vertical} /> : null
                }
                {layout === 'config' ?
                    <Config data={this.props.vertical} /> : null
                }
                {layout === 'mosaic' ?
                        this.props.vertical.mosaicContainer.map(function(result, id) {
                        return (
                            <div className="c-mosaic fullscreen-mosaic" key={id} >
                                    <MosaicContainer key={id} mosaics={result}  />
                            </div>
                        )
                        }) : null
                }
            </section>
        )
    }
}

export default Vertical