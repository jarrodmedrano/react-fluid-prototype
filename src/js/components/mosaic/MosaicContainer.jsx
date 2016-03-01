import React from 'react';
import Mosaic from 'src/js/components/mosaic/mosaic.jsx!';

var MosaicContainer = React.createClass({
    render() {
        return (
            <div className="c-mosaic">
                <div data-f-mosaic={this.props.containerSize}>
                    <Mosaic mosaicSize="f-vp2-half f-vp3-quarter f-height-medium" />
                    <Mosaic mosaicSize="f-vp2-half f-vp3-quarter f-height-medium" />
                    <Mosaic mosaicSize="f-vp2-half f-vp3-quarter f-height-medium" />
                    <Mosaic mosaicSize="f-vp2-half f-vp3-quarter f-height-medium" />
                </div>
            </div>
        )
    }
});

export default MosaicContainer;