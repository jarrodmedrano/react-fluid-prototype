import React from 'react';
import Mosaic from 'src/js/components/mosaic/mosaic';

var MosaicContainer = React.createClass({


    render() {

        let results = this.props.mosaics;

        return (
            <div>
                {results.map(function(result, id) {
                    return result.map(function(myresult, id) {
                        return (
                        <div data-f-mosaic={result[id].containerSize}>
                            <Mosaic key={id} mosaic={result[id]} />
                        </div>
                        )
                    })
                })}
            </div>
        )
    }
});

export default MosaicContainer;