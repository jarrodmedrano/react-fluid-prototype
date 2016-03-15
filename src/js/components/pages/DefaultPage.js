import React from 'react'
import Hero from 'src/js/components/hero/hero';
import MosaicContainer from 'src/js/components/mosaic/MosaicContainer'
import _ from 'lodash'

class DefaultPage extends React.Component {

    render() {
        return (
            <div>
                <Hero heroTitle="What are you using your Surface fors?" heroSrc="en-INTL-PDP0-Surface-Pro4-SU3-00001-Large-desktop" heroSize="f-medium" fX="f-x-left" />
            </div>
        );
    }
}

export default DefaultPage
