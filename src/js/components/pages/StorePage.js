import React from 'react'
//import FlipView from 'src/js/components/flipview/FlipView';
import SideBar from 'src/js/components/sidebar/SideBar';
import Carousel from 'src/js/components/carousel/Carousel';

var StorePage = React.createClass({
    render() {
        return (
            <div>
                <Carousel fullscreen="true" />
            </div>
        );
    }
});

export default StorePage