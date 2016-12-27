import React from 'react'
import './mosaic.scss!'
import MosaicContainer from './MosaicContainer';
import propsAreValid from '../../util';
import mosaicPropTypes from '../../../data/dataProps';
import dataPropTypes from '../../../data/dataProps';

class Mosaic extends React.Component {
    render() {
        if(propsAreValid(this.props.data)) {
            return (
                <div className="m-mosaic">
                    <MosaicContainer data={this.props.data.mosaic} />
                </div>
            )
        } return null
    }
}

Mosaic.propTypes = dataPropTypes(mosaicPropTypes);

export default Mosaic
