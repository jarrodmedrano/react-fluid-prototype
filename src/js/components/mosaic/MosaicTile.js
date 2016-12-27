import React from 'react';
import Picture from '../picture/Picture';
import Heading from '../heading/Heading';
import propsAreValid from '../../util';

class MosaicTile extends React.Component {
    render() {
        if(propsAreValid(this.props.data)) {
            return (
                <section className="c-mosaic-placement">
                    <Picture data={this.props.data} />
                    {(this.props.size != 'small') ? <Heading data={this.props.data} /> : null}
                </section>
            )
        } return null
    }
}

MosaicTile.defaultProps = {
       data: {}
};

MosaicTile.propTypes = {
  data: React.PropTypes.object.isRequired
};

export default MosaicTile;
