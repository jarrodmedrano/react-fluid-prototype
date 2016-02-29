import React from 'react'
import FlipView from 'src/js/components/flipview/FlipView.jsx!';
import SideBar from 'src/js/components/sidebar/SideBar.jsx!';

var HomePage = React.createClass({

    render() {

        var slides = [
            {
                type: "item",
                title: "Celebrate the holidays with us by coloring in some fun stencils",
                buttonText: "Happy Holidays",
                bg: "url(img/slide-christmas.jpg)"
            },
            {
                type: "item",
                title: "Guided Stories",
                text: "Lorem ipsum dolor sit amet adipscing elit, lorem ipsum",
                buttonText: "Try it out",
                bg: "#7DA5AF",
                icon: "img/slide-logo.png"
            },
            {
                type: "item",
                title: "Start the school year right with up to $150 off select Surface Pro 4 models",
                buttonText: "Shop Now",
                bg: "url(img/slide-surface.jpg)"
            },
            {
                type: "item",
                title: "Learn how to draw in Windows 10 with Edge and OneNote",
                buttonText: "Reserve now",
                bg: "url(img/slide-store.jpg)"
            }
        ];

        var sideBarList = [
            {
                title: 'Software',
                icon: 'desktop'
            }
        ]

        return (
            <div>
                <SideBar />
                <div className="flipview-wrapper">
                    <FlipView slides={slides} />
                </div>
            </div>
        );
    }
});

export default HomePage
