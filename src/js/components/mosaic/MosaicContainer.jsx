import React from 'react';
import Mosaic from 'src/js/components/mosaic/mosaic.jsx!';

var MosaicContainer = React.createClass({


    render() {

        let results = this.props.mosaic;

        return (
            <div data-f-mosaic={this.props.containerSize}>
                {results.map(function(result, id) {
                    return  <Mosaic key={id} mosaic={results[id]} />;
                })}
            </div>
        )
    }
});

export default MosaicContainer;