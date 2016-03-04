import React from 'react'
import Hero from 'src/js/components/hero/hero';
import MosaicContainer from 'src/js/components/mosaic/MosaicContainer';

var OfficePage = React.createClass({

    render() {

        let defaultMosaic = [
            {
                mosaicTitle: "Microsoft Word",
                mosaicSize: "f-vp1-whole f-vp2-half f-height-medium",
                context: 'context-app',
                logo: 'img/word-logo.svg',
                mosaicStyle: {'background': '#2b5796'},
                mosaicHeading: true,
                mosaicCta: 'Buy Now'
            },
            {
                mosaicTitle: "PowerPoint",
                mosaicSize: "f-vp1-whole f-vp2-half f-height-medium",
                context: 'context-app',
                logo: 'img/powerpoint-logo.svg',
                mosaicStyle: {'background': '#d04525'},
                mosaicHeading: true,
                mosaicCta: 'Buy Now'
            },
            {
                mosaicTitle: "Excel",
                mosaicSize: "f-vp1-whole f-height-small",
                context: 'context-app',
                logo: 'img/excel-logo.svg',
                mosaicStyle: {'background': '#1d7044'},
                mosaicHeading: true,
                mosaicCta: 'Buy Now'
            }
        ];

        let largeMosaic = [
            {
                mosaicTitle: "Microsoft OneNote",
                mosaicSize: "c-placement context-accessory f-width-large f-height-large",
                mosaicStyle: {'background': '#7e3878'},
                context: 'context-app',
                logo: 'img/onenote-logo.svg',
                mosaicHeading: true,
                mosaicCta: 'Buy Now'
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

export default OfficePage
