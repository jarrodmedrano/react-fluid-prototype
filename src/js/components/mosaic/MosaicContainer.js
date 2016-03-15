import React from 'react';
import Mosaic from 'src/js/components/mosaic/mosaic';

var MosaicContainer = React.createClass({


    render() {

        let results = this.props.mosaics;


        return (
            <div className="c-mosaic surface-mosaic">
                {results.map(function(result, id) {
                    return (
                        <div key={id} data-f-mosaic={result.containerSize}>
                        </div>
                    )
                })}
            </div>
        )
    }
});

export default MosaicContainer;