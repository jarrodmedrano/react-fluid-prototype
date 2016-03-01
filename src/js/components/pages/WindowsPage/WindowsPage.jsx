import React from 'react'
import Hero from 'src/js/components/hero/hero.jsx!';
import MosaicContainer from 'src/js/components/mosaic/MosaicContainer.jsx!';

var WindowsPage = React.createClass({

    render() {

        return (
            <div>
                <Hero />
                <MosaicContainer containerSize="f-vp1-whole f-vp4-whole" />
            </div>
        );
    }
});

export default WindowsPage