import React from 'react'
import Hero from 'src/js/components/hero/hero.jsx!';
import MosaicContainer from 'src/js/components/mosaic/MosaicContainer.jsx!';

var WindowsPage = React.createClass({

    render() {

        return (
            <div>
                <Hero heroSrc="http://c2278.paas2.tx.modxcloud.com/images/components/division-hero-background" />
                <MosaicContainer containerSize="f-vp1-whole f-vp4-whole" />
            </div>
        );
    }
});

export default WindowsPage