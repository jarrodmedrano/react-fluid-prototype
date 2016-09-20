import React from 'react'
import classNames from 'classnames';
import SurfaceBookIntro from './surfaceintro/SurfaceBookIntro';
import Parallax from './parallax/Parallax';
import Fullscreen from './fullscreen/Fullscreen';
import Apps from './apps/Apps';
import Config from './config/Config';
import Hello from './hello/Hello';
import MosaicContainer from '../mosaic/MosaicContainer';

class Vertical extends React.Component {

    render() {

        let verticalClass = classNames('scene-vertical', this.props.vertical.groupIdentifier);

        let layout = this.props.vertical.layout;

        return (
            <section className={verticalClass}  id={this.props.vertical.title.split(' ').join('-').toLowerCase()}>
                {layout === 'surfacebookintro' ?
                    <SurfaceBookIntro data={this.props.vertical} /> : null
                }
                {layout === 'parallax' ?
                    <Parallax data={this.props.vertical} /> : null
                }
                {layout === 'fullscreen' ?
                    <Fullscreen data={this.props.vertical} /> : null
                }
                {layout === 'apps' ?
                    <Apps data={this.props.vertical} /> : null
                }
                {layout === 'hello' ?
                    <Hello data={this.props.vertical} /> : null
                }
                {layout === 'config' ?
                    <Config data={this.props.vertical} /> : null
                }
                {layout === 'mosaic' ?
                        this.props.vertical.mosaicContainer.map(function(result, id) {
                        return (
                            <div className="c-mosaic fullscreen-mosaic">
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