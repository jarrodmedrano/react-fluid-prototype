import React from 'react';
import Mosaic from 'src/js/components/mosaic/mosaic';

class MosaicContainer extends React.Component {

    render() {

        let results = this.props.mosaics;

        return (
                <div data-f-mosaic={results.containerSize}>
                    {results.mosaics.map(function(result, id) {
                        return <Mosaic key={id} mosaic={result} />
                    })}
                </div>
        )
    }
}

export default MosaicContainer;