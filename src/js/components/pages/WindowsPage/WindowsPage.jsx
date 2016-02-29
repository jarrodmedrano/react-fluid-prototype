import React from 'react'

var WindowsPage = React.createClass({

    render() {
        let slideBG = {
            background: "url(img/Windows_Mosaic_2x.png)",
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat'
        };

        return (
            <div style={slideBG} className="bg-page">
            </div>
        );
    }
});

export default WindowsPage