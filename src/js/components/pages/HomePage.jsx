import React from 'react'
//import FlipView from 'src/js/components/flipview/FlipView.jsx!';
//import SideBar from 'src/js/components/sidebar/SideBar.jsx!';
import Hero from 'src/js/components/hero/hero.jsx!';
import Mosaic from 'src/js/components/mosaic/mosaic.jsx!';

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
                <div className="c-mosaic">
                    <Mosaic />
                    <Mosaic />
                    <Mosaic />
                    <Mosaic />
                </div>
            </div>
        );
    }
});

export default HomePage
