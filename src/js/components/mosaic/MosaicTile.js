import React from 'react';
import Picture from '../picture/Picture';
import classNames from 'classnames';
import Heading from '../heading/Heading';
import ButtonLink from '../link/ButtonLink'
import propsAreValid from '../../lib/util';
import dataPropTypes, {tilePropTypes} from '../../../data/dataProps';

class MosaicTile extends React.Component {
    render() {
        if(propsAreValid(this.props.data)) {
            let { textColor, backgroundColor } = this.props.data;

            let tileStyle = {
                background: backgroundColor,
                color: textColor
            };

            if(propsAreValid(this.props.data.button)) {
                let { overlay } = this.props.data.button;

                return (
                    <ButtonLink to={this.props.data.button.link}  >
                        <section className="c-mosaic-placement c-placement" style={tileStyle}>
                            {overlay ? <div className="c-image-overlay" aria-hidden="true" style={{backgroundColor: overlay}}></div> : null }
                            <Picture data={this.props.data} />
                            {this.props.data.button.text && (this.props.size != 'small') ? <Heading data={this.props.data} /> : null}
                        </section>
                    </ButtonLink>
                )
            } else {
                return (
                    <section className="c-mosaic-placement">
                        <Picture data={this.props.data}/>
                        {(this.props.size != 'small') ? <Heading data={this.props.data}  /> : null}
                    </section>
                )
            }
        } return null
    }
}

MosaicTile.propTypes = dataPropTypes(tilePropTypes);


export default MosaicTile;
