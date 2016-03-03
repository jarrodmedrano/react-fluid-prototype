import React from 'react'
//import FlipView from 'src/js/components/flipview/FlipView';
import SideBar from 'src/js/components/sidebar/SideBar';
import Hero from 'src/js/components/hero/hero';

var StorePage = React.createClass({
    render() {
        return (
            <div>
                <Hero fullscreen="true" fY="f-y-bottom" heroSrc="Tomb_Raider_Cave_1344x728" />
            </div>
        );
    }
});

export default StorePage