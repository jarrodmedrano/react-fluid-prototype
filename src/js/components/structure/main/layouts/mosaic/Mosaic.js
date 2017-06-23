import React from 'react'
import MosaicContainer from './MosaicContainer';
import LegalText from '../../../../generic/legal/Legal';
import propsAreValid from '../../../../../lib/util';
import dataPropTypes, {mosaicPropTypes} from '../../../../../../data/dataProps';
// import './test.scss!';

class Mosaic extends React.Component {
    shouldComponentUpdate(nextProps) {
        if(this.props.data !== nextProps.data) {
            return true;
        }
        return false;
    }

    render() {
        if(propsAreValid(this.props.data, this)) {
            const {legalText} = this.props.data;

            return (
                <div>
                    <div className="m-mosaic">
                        <MosaicContainer data={this.props.data} />
                        {legalText ? <LegalText data={legalText} /> : null}
                    </div>
                </div>
            )
        } return null
    }
}

Mosaic.propTypes = dataPropTypes(mosaicPropTypes);

export default Mosaic
