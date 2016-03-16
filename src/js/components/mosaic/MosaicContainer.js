import React from 'react';
import Mosaic from 'src/js/components/mosaic/mosaic';

var MosaicContainer = React.createClass({


    render() {

        let results = this.props.mosaics;




        return (
                <div data-f-mosaic={results.containerSize}>
                    {results.mosaics.map(function(result, id) {
                        console.log(result)
                        return <Mosaic key={id} mosaic={result} />
                    })}
                </div>
        )
    }
});

export default MosaicContainer;