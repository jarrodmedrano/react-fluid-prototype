import React from 'react';
import Picture from '../picture/Picture';
import Heading from '../heading/Heading';
import propsAreValid from '../../util';

class MosaicTile extends React.Component {
    render() {
        if(propsAreValid(this.props)) {
            return (
            <section className="c-mosaic-placement">
                <Picture data={this.props.data} />
                <Heading data={this.props.data} />
            </section>
        )} else {
            return null
        }
    }
}

export default MosaicTile;