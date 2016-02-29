import React from 'react'
//import FlipView from 'src/js/components/flipview/FlipView.jsx!';
//import SideBar from 'src/js/components/sidebar/SideBar.jsx!';
import Hero from 'src/js/components/hero/hero.jsx!';

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
            </div>
        );
    }
});

export default HomePage
