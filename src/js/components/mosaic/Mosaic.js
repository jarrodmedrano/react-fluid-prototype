import React from 'react'
import './mosaic.scss!'
import MosaicContainer from './MosaicContainer';

class Mosaic extends React.Component {
    render() {
        return (
            <div className="m-mosaic">
                <MosaicContainer data={this.props.data.mosaic}  />
            </div>
        )
    }
}

export default Mosaic