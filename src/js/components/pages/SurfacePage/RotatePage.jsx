import React from 'react'
import SubLinkBand from 'src/js/components/SubLinkBand/SubLinkBand.jsx!';

var RotatePage = React.createClass({

    render() {

        let slideBG = {
            background: "url(img/Device_360_Back.png)",
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat'
        };

        return (
            <div style={slideBG} className="bg-page">

            </div>
        );
    }
});

export default RotatePage
