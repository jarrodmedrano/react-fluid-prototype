import React from 'react'
import SubLinkBand from 'src/js/components/SubLinkBand/SubLinkBand.jsx!';
import Hero from 'src/js/components/hero/hero.jsx!';
var RotatePage = React.createClass({

    render() {


        return (
            <div >
                <Hero fullscreen="true" fY="f-y-bottom" heroSrc="http://c2278.paas2.tx.modxcloud.com/images/components/division-hero-background" />
            </div>
        );
    }
});

export default RotatePage
