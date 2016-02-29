import React from 'react'
import SubLinkBand from 'src/js/components/SubLinkBand/SubLinkBand.jsx!';

var AccessoriesPage = React.createClass({

    render() {

        let slideBG = {
            background: "url(img/accessories.png)",
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat'
        };

        return (
            <div style={slideBG} className="bg-page">

            </div>
        );
    }
});

export default AccessoriesPage
