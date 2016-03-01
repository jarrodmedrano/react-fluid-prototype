import React from 'react';
import Mosaic from 'src/js/components/mosaic/mosaic.jsx!';

var MosaicContainer = React.createClass({


    render() {

        let defaultMosaic = [
            {
                mosaicTitle: "Rise of the Tomb Raider",
                mosaicSize: "f-vp1-whole f-vp2-half f-vp3-quarter f-height-medium",
                mosaicImage: "http://www.getmwf.com/images/components/placement-background-tombraider.jpg"
            },
            {
                mosaicTitle: "Forza Horizon 2",
                mosaicSize: "f-vp1-whole f-vp2-half f-vp3-quarter f-height-medium",
                mosaicImage: "http://www.getmwf.com/images/components/placement-background-forza.jpg"
            },
            {
                mosaicTitle: "Xbox One Elite bundle",
                mosaicSize: "f-vp1-whole f-vp2-half f-vp3-quarter f-height-medium",
                mosaicImage: "http://www.getmwf.com/images/components/placement-background-xboxcontroller.jpg"
            },
            {
                mosaicTitle: "Halo 5",
                mosaicSize: "f-vp1-whole f-vp2-half f-vp3-quarter f-height-medium",
                mosaicImage: "http://www.getmwf.com/images/components/placement-background-halo.jpg"
            }
        ];

        return (
            <div className="c-mosaic">
                <div data-f-mosaic={this.props.containerSize}>
                    <Mosaic mosaic={defaultMosaic[0]} />
                    <Mosaic mosaic={defaultMosaic[1]} />
                    <Mosaic mosaic={defaultMosaic[2]} />
                    <Mosaic mosaic={defaultMosaic[3]} />
                </div>
            </div>
        )
    }
});

export default MosaicContainer;