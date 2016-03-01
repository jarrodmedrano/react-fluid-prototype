import React from 'react'
//import FlipView from 'src/js/components/flipview/FlipView.jsx!';
//import SideBar from 'src/js/components/sidebar/SideBar.jsx!';
import Hero from 'src/js/components/hero/hero.jsx!';
import MosaicContainer from 'src/js/components/mosaic/MosaicContainer.jsx!';
import Carousel from 'src/js/components/carousel/carousel.jsx!';

var HomePage = React.createClass({
    render() {
        return (
            <div>
                <Carousel />
                <MosaicContainer containerSize="f-vp1-whole f-vp4-whole" />
            </div>
        );
    }
});

export default HomePage
