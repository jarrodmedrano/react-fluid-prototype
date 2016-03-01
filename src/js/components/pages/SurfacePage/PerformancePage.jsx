import React from 'react'
import SubLinkBand from 'src/js/components/SubLinkBand/SubLinkBand.jsx!';
import Carousel from 'src/js/components/carousel/Carousel.jsx!';

var PerformancePage = React.createClass({
    render() {

        return (
            <div>
                <Carousel fullscreen="true" />
            </div>
        );
    }
});

export default PerformancePage