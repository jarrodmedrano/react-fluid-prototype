import React from 'react';
import Mosaic from 'src/js/components/mosaic/mosaic';

class MosaicContainer extends React.Component {

    render() {

        let results = this.props.mosaics;



        return (
                <div data-f-mosaic={results.containerSize}>
                    {results.mosaics.map(function(result, id) {

                        if(result.containerSize) {
                            return (
                                <div data-f-mosaic={result.containerSize}>
                                    {result.mosaics.map(function(result2, id2) {
                                        return <Mosaic key={id2} mosaic={result2} />
                                    })}
                                </div>
                            )
                        } else {
                            return <Mosaic key={id} mosaic={result} mosaicChildren={result.mosaicChildren} />
                        }

                    })}
                </div>
        )
    }
}

export default MosaicContainer;