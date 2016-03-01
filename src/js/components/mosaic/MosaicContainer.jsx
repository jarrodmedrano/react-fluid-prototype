import React from 'react';
import Mosaic from 'src/js/components/mosaic/mosaic.jsx!';

var MosaicContainer = React.createClass({
    render() {
        return (
            <div className="c-mosaic">
                <div data-f-mosaic={this.props.containerSize}>
                    <Mosaic mosaicTitle="Rise of the Tomb Raider" mosaicImage="http://www.getmwf.com/images/components/placement-background-tombraider.jpg" mosaicSize="f-vp1-whole f-vp2-half f-vp3-quarter f-height-medium" />
                    <Mosaic mosaicTitle="Forza Horizon 2" mosaicImage="http://www.getmwf.com/images/components/placement-background-forza.jpg" mosaicSize="f-vp1-whole f-vp2-half f-vp3-quarter f-height-medium" />
                    <Mosaic mosaicTitle="Xbox One Elite bundle" mosaicImage="http://www.getmwf.com/images/components/placement-background-xboxcontroller.jpg" mosaicSize="f-vp1-whole f-vp2-half f-vp3-quarter f-height-medium" />
                    <Mosaic mosaicTitle="Halo 5" mosaicImage="http://www.getmwf.com/images/components/placement-background-halo.jpg" mosaicSize="f-vp1-whole f-vp2-half f-vp3-quarter f-height-medium" />
                </div>
            </div>
        )
    }
});

export default MosaicContainer;