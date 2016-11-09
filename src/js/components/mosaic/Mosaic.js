import React from 'react'
import './mosaic.scss!'
import MosaicContainer from './MosaicContainer';
import propsAreValid from '../../util';

class Mosaic extends React.Component {
    render() {
        if(propsAreValid(this.props.data)) {
            return (
                <div className="m-mosaic">
                    <MosaicContainer data={this.props.data.mosaic}/>
                </div>
            )
        }
    }
}

export default Mosaic