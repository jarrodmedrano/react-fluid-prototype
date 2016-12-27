import React from 'react'
import classNames from 'classnames';
import FullScreen from '../fullscreen/FullScreen';
import Hero from '../hero/Hero';
import Mosaic from '../mosaic/Mosaic';
import CompareTable from '../compare/CompareTable';

class Vertical extends React.Component {
    render() {
        let verticalClass = classNames('scene-vertical', this.props.data.groupIdentifier, this.props.data.sectionIdentifier.toLowerCase());
        let {layout, ordinal} = this.props.data;
        return (
            <section className={verticalClass} id={ordinal}>
                {layout === 'hero' || layout === 'immersive-hero' ?
                    <Hero data={this.props.data}/> : null
                }
                {layout === 'parallax' ?
                    <Parallax data={this.props.data}/> : null
                }
                {layout === 'fullscreen' ?
                    <FullScreen data={this.props.data}/> : null
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
                {layout === 'compare' ?
                    <CompareTable data={this.props.data}/> : null
                }
            </section>
        )
    }
}

export default Vertical
