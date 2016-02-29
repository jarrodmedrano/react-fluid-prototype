import React from 'react'

var OfficePage = React.createClass({

    render() {
        let slideBG = {
            background: "#eb3d01",
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat'
        };

        return (
            <div style={slideBG} className="bg-page">
                {this.props.children}
            </div>
        );
    }
});

export default OfficePage
