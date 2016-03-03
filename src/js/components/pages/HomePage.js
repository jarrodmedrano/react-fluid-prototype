import React from 'react'
import Hero from 'src/js/components/hero/hero';
import MosaicContainer from 'src/js/components/mosaic/MosaicContainer';

var HomePage = React.createClass({
    render() {
        let defaultMosaic = [
            {
                mosaicTitle: "For Business",
                mosaicSize: "f-vp1-whole f-vp2-half f-vp3-quarter",
                mosaicImage: "img/work.jpg"
            },
            {
                mosaicTitle: "For School",
                mosaicSize: "f-vp1-whole f-vp2-half f-vp3-quarter",
                mosaicImage: "img/for-school.jpg"
            },
            {
                mosaicTitle: "For Play",
                mosaicSize: "f-vp1-whole f-vp2-half f-vp3-quarter",
                mosaicImage: "img/art.jpg"
            },
            {
                mosaicTitle: "On the Go",
                mosaicSize: "f-vp1-whole f-vp2-half f-vp3-quarter",
                mosaicImage: "img/on-the-go.jpg"
            }
        ];

        return (
            <div>
                <Hero heroTitle="What are you using your Surface for?" heroSrc="en-INTL-PDP0-Surface-Pro4-SU3-00001-Large-desktop" heroSize="f-medium" fX="f-x-left" />
                <div className="c-mosaic">
                    <MosaicContainer mosaic={defaultMosaic} containerSize="f-vp1-whole f-vp4-whole" />
                </div>
            </div>
        );
    }
});

export default HomePage
