import React from 'react';
import Picture from '../picture/Picture';
import Heading from '../heading/Heading';

class MosaicTile extends React.Component {


    componentWillMount() {
        if(!this.props.data) {
            this.state.render = false;
        }
    }

    render() {
            if(this.state.render) {
            return (
            <section className="c-mosaic-placement">
                <Picture data={this.props.data} />
                <Heading data={this.props.data} />
            </section>
            )
            } else {
                return null
            }
    }
}


export default MosaicTile;
