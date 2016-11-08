import React from 'react';
import Picture from '../picture/Picture';
import Heading from '../heading/Heading';

class MosaicTile extends React.Component {
    render() {
        return (
            <section className="c-mosaic-placement">
                <Picture data={this.props.data}/>
                <Heading data={this.props.data}/>
            </section>
        )
    }
}
export default MosaicTile;
