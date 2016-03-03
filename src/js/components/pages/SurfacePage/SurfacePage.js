import React from 'react'
import MosaicContainer from 'src/js/components/mosaic/MosaicContainer'

var SurfacePage = React.createClass({

    render() {

        let defaultMosaic = [
            {
                mosaicTitle: "Forza Horizon 2",
                mosaicSize: "f-vp1-whole f-vp2-half f-height-small",
                mosaicImage: "http://www.getmwf.com/images/components/placement-background-forza.jpg"
            },
            {
                mosaicTitle: "Xbox One Elite bundle",
                mosaicSize: "f-vp1-whole f-vp2-half f-height-small",
                mosaicImage: "http://www.getmwf.com/images/components/placement-background-xboxcontroller.jpg"
            },
            {
                mosaicTitle: "Halo 5",
                mosaicSize: "f-vp1-whole f-height-medium",
                mosaicImage: "http://www.getmwf.com/images/components/placement-background-halo.jpg"
            }
        ];

        let largeMosaic = [
            {
                mosaicTitle: "Rise of the Tomb Raider",
                mosaicSize: "c-placement context-accessory f-width-large f-height-large",
                mosaicImage: "http://www.getmwf.com/images/components/placement-background-tombraider.jpg"
            }
        ];

        return (
            <div className="c-mosaic surface-mosaic">
                <MosaicContainer mosaic={largeMosaic} containerSize="f-vp1-whole f-vp4-half f-height-large" />
                <MosaicContainer mosaic={defaultMosaic} containerSize="f-vp1-whole f-vp4-half" />
            </div>
        );
    }
});

export default SurfacePage
