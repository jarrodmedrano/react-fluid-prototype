import React from 'react'
import MosaicContainer from './MosaicContainer';
import propsAreValid from '../../../../../lib/util';
import dataPropTypes, {mosaicPropTypes} from '../../../../../../data/dataProps';

class Mosaic extends React.Component {
    render() {
        if(propsAreValid(this.props.data, this)) {
            return (
                <div className="m-mosaic">
                    <MosaicContainer data={this.props.data} />
                </div>
            )
        } return null
    }
}

Mosaic.propTypes = dataPropTypes(mosaicPropTypes);

export default Mosaic
