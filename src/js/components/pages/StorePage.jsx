import React from 'react'
import FlipView from 'src/js/components/flipview/FlipView.jsx!';
import SideBar from 'src/js/components/sidebar/SideBar.jsx!';

var StorePage = React.createClass({
    render() {

        var slides = [
            {
                type: "item",
                title: "Lorem ipsum dolor sit amet adipscing dolor sit amet",
                buttonText: "Lorem Ipsum",
                bg: "url(img/slide-store-entrance.jpg)"
            },
            {
                type: "item",
                title: "Learn how to draw in Windows 10 with Edge and OneNote",
                buttonText: "Reserve now",
                bg: "url(img/slide-store.jpg)"
            }
        ];


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

export default StorePage