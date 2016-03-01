import React from 'react'
//import FlipView from 'src/js/components/flipview/FlipView.jsx!';
import SideBar from 'src/js/components/sidebar/SideBar.jsx!';
import Hero from 'src/js/components/hero/hero.jsx!';

var StorePage = React.createClass({
    render() {
        return (
            <div>
                <Hero fullscreen="true" />
            </div>
        );
    }
});

export default StorePage