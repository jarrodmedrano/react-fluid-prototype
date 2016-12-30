import React from 'react';
import Picture from '../picture/Picture';
import Heading from '../heading/Heading';
import Link from '../link/Link'
import propsAreValid from '../../util';
import dataPropTypes, {tilePropTypes} from '../../../data/dataProps';

class MosaicTile extends React.Component {
    render() {
        if(propsAreValid(this.props.data)) {
            if(propsAreValid(this.props.data.button)) {
                return (
                    <Link to={this.props.data.button.path}>
                        <section className="c-mosaic-placement c-placement">
                            <div className="c-image-overlay" aria-hidden="true"></div>
                            <Picture data={this.props.data} />
                            {(this.props.size != 'small') ? <Heading data={this.props.data} /> : null}
                        </section>
                    </Link>
                )
            } else {
                return (
                    <section className="c-mosaic-placement">
                        <Picture data={this.props.data}/>
                        {(this.props.size != 'small') ? <Heading data={this.props.data} /> : null}
                    </section>
                )
            }
        } return null
    }
}

MosaicTile.propTypes = dataPropTypes(tilePropTypes);


export default MosaicTile;
