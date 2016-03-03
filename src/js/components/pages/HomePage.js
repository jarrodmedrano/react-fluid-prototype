import React from 'react'
import Hero from 'src/js/components/hero/hero';
import MosaicContainer from 'src/js/components/mosaic/MosaicContainer';

var HomePage = React.createClass({
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
            <div>
                <Hero heroTitle="What are you using your Surface for?" heroSrc="Surface_Book_Laptop_01" heroFileType="png" heroSize="f-medium" heroStyle={{'height': '30vh'}} />
                <div className="c-mosaic" style={{'height': '70vh'}}>
                    <MosaicContainer mosaic={defaultMosaic} containerSize="f-vp1-whole f-vp4-whole" />
                </div>
            </div>
        );
    }
});

export default HomePage
