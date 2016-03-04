import React from 'react'
import MosaicContainer from 'src/js/components/mosaic/MosaicContainer'

var SurfacePage = React.createClass({

    render() {

        let defaultMosaic = [
            {
                mosaicTitle: "Surface Pens",
                mosaicSize: "f-vp1-whole f-vp2-half f-height-small",
                mosaicImage: "img/surface-pen.jpg",
                mosaicCta: 'Buy Now'
            },
            {
                mosaicTitle: "The Surface Dock",
                mosaicSize: "f-vp1-whole f-vp2-half f-height-small",
                mosaicImage: "img/surface-dock.jpg",
                mosaicCta: 'Buy Now'
            },
            {
                mosaicTitle: "Type covers in your favorite colors to fit your style",
                mosaicSize: "f-vp1-whole f-height-medium",
                mosaicImage: "img/surface-keyboard.jpg",
                mosaicCta: 'Buy Now'
            }
        ];

        let largeMosaic = [
            {
                mosaicTitle: "Surface Pro 4",
                mosaicSize: "c-placement context-accessory f-width-large f-height-large",
                mosaicImage: "img/surfacepro.jpg",
                mosaicCta: 'Show me more'
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
