import React from 'react'
import Hero from 'src/js/components/hero/hero';
import MosaicContainer from 'src/js/components/mosaic/MosaicContainer';

var WindowsPage = React.createClass({

    render() {

        let defaultMosaic = [
            {
                mosaicTitle: "A more personal, more secure way to unlock your Windows device",
                mosaicSize: "f-vp1-whole f-height-medium",
                mosaicStyle: {'background': '#7DA4AE'},
                mosaicHeading: true,
                context: 'context-app',
                logo: 'img/windows-hello.svg'
            },
            {
                mosaicTitle: "Try Out Inking in Edge",
                mosaicSize: "f-vp1-whole f-height-small",
                mosaicStyle: {'background': '#0063AF'}
            }
        ];

        let largeMosaic = [
            {
                mosaicTitle: "The Pen is mightier in Windows",
                mosaicSize: "c-placement context-accessory f-width-large f-height-large",
                mosaicImage: "img/windows-pen.jpg"
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

export default WindowsPage