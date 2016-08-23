import React from 'react'
import classNames from 'classnames';
import SurfaceBookIntro from 'src/js/components/vertical/surfaceintro/SurfaceBookIntro';
import Parallax from 'src/js/components/vertical/parallax/Parallax';
import Fullscreen from 'src/js/components/vertical/fullscreen/Fullscreen';
import Apps from 'src/js/components/vertical/apps/Apps';
import Config from 'src/js/components/vertical/config/Config';
import Hello from 'src/js/components/vertical/hello/Hello'
import MosaicContainer from 'src/js/components/mosaic/MosaicContainer';

class Vertical extends React.Component {

    render() {

        let verticalClass = classNames('scene-vertical', this.props.vertical.type);

        return (
            <section className={verticalClass}  id={this.props.vertical.title.split(' ').join('-').toLowerCase()}>
                {this.props.vertical.type === 'surfacebookintro' ?
                    <SurfaceBookIntro data={this.props.vertical} /> : null
                }
                {this.props.vertical.type === 'parallax' ?
                    <Parallax data={this.props.vertical} /> : null
                }
                {this.props.vertical.type === 'fullscreen' ?
                    <Fullscreen data={this.props.vertical} /> : null
                }
                {this.props.vertical.type === 'apps' ?
                    <Apps data={this.props.vertical} /> : null
                }
                {this.props.vertical.type === 'hello' ?
                    <Hello data={this.props.vertical} /> : null
                }
                {this.props.vertical.type === 'config' ?
                    <Config data={this.props.vertical} /> : null
                }
                {this.props.vertical.type === 'mosaic' ?
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