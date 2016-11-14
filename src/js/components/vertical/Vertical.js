import React from 'react'
import classNames from 'classnames';
import Video from '../video/Video';
import Hero from '../hero/Hero';
import ImmersiveHero from '../hero/ImmersiveHero';
import Mosaic from '../mosaic/Mosaic';

class Vertical extends React.Component {

    render() {

        let verticalClass = classNames('scene-vertical', this.props.data.groupIdentifier);

        let layout = this.props.data.layout;

        return (
            <section className={verticalClass} id={this.props.data.title.split(' ').join('-').toLowerCase()}>
                {layout === 'hero' ?
                    <Hero data={this.props.data}/> : null
                }
                {layout === 'immersive-hero' ?
                    <ImmersiveHero data={this.props.data}/> : null
                }
                {layout === 'parallax' ?
                    <Parallax data={this.props.data}/> : null
                }
                {layout === 'video' ?
                    <Video data={this.props.data}/> : null
                }
                {layout === 'apps' ?
                    <Apps data={this.props.data}/> : null
                }
                {layout === 'config' ?
                    <Config data={this.props.data}/> : null
                }
                {layout === 'mosaic' ?
                    <Mosaic data={this.props.data}/> : null
                }
            </section>
        )
    }
}

export default Vertical
