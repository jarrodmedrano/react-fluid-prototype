import React from 'react'
import SubLinkBand from 'src/js/components/SubLinkBand/SubLinkBand.jsx!';

var PerformancePage = React.createClass({

    render() {

        let slideBG = {
            background: "url(img/Device_Landing.png)",
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat'
        };

        return (
            <div style={slideBG} className="bg-page">

            </div>
        );
    }
});

export default PerformancePage