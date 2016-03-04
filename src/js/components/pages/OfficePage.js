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
                logo: 'img/word-logo.png',
                mosaicStyle: {'background': '#2b5796'},
                mosaicHeading: true
            },
            {
                mosaicTitle: "PowerPoint",
                mosaicSize: "f-vp1-whole f-vp2-half f-height-medium",
                context: 'context-app',
                logo: 'img/powerpoint-logo.png',
                mosaicStyle: {'background': '#d04525'},
                mosaicHeading: true
            },
            {
                mosaicTitle: "Excel",
                mosaicSize: "f-vp1-whole f-height-small",
                context: 'context-app',
                logo: 'img/excel-logo.png',
                mosaicStyle: {'background': '#1d7044'},
                mosaicHeading: true
            }
        ];

        let largeMosaic = [
            {
                mosaicTitle: "Microsoft OneNote",
                mosaicSize: "c-placement context-accessory f-width-large f-height-large",
                mosaicStyle: {'background': '#7e3878'},
                context: 'context-app',
                logo: 'img/onenote-logo.png',
                mosaicHeading: true
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
