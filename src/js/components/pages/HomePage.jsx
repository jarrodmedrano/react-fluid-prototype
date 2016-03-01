import React from 'react'
//import FlipView from 'src/js/components/flipview/FlipView.jsx!';
//import SideBar from 'src/js/components/sidebar/SideBar.jsx!';
import Hero from 'src/js/components/hero/hero.jsx!';
import MosaicContainer from 'src/js/components/mosaic/MosaicContainer.jsx!';

var HomePage = React.createClass({

    render() {

        var sideBarList = [
            {
                title: 'Software',
                icon: 'desktop'
            }
        ]

        return (
            <div>
                <Hero />
                <MosaicContainer containerSize="f-vp1-whole f-vp4-whole" />
            </div>
        );
    }
});

export default HomePage
