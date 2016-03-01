import React from 'react'
import SubLinkBand from 'src/js/components/SubLinkBand/SubLinkBand.jsx!';
import Hero from 'src/js/components/hero/hero.jsx!';
import MosaicContainer from 'src/js/components/mosaic/MosaicContainer.jsx!';

var PerformancePage = React.createClass({
    render() {
        {console.log('performance page')}

        return (
            <div>
                <Hero />
                <MosaicContainer containerSize="f-vp1-whole f-vp4-whole" />
            </div>
        );
    }
});

export default PerformancePage