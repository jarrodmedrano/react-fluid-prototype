import React from 'react';
import MosaicPicture from '../picture/MosaicPicture';
import classNames from 'classnames';
import Heading from '../heading/Heading';
import ButtonLink from '../link/ButtonLink'
import propsAreValid from '../../lib/util';
import dataPropTypes, {tilePropTypes} from '../../../data/dataProps';

class MosaicTile extends React.Component {
    render() {
        if(propsAreValid(this.props.data, this)) {
            let { headingBlock, pictureBlock, hoverEffectColor } = this.props.data;
            let { textColor, backgroundColor, } = headingBlock;

            let tileStyle = {
                background: backgroundColor,
                color: textColor
            };

            if(propsAreValid(headingBlock.button, this)) {
                return (
                    <ButtonLink to={headingBlock.button.link} layout="mosaic" className="mosaic-link" draggable="false">
                        <section className="c-mosaic-placement c-placement" style={tileStyle}>
                            {hoverEffectColor ? <div className="c-image-overlay" aria-hidden="true" style={{backgroundColor: hoverEffectColor}}></div> : null }
                            {pictureBlock ? <MosaicPicture data={pictureBlock} /> : null}
                            {headingBlock && (this.props.size != 'small') && headingBlock.heading ? <Heading data={headingBlock} /> : null}
                        </section>
                    </ButtonLink>
                )
            } else {
                return (
                    <section className="c-mosaic-placement">
                        {pictureBlock ? <MosaicPicture data={pictureBlock} /> : null}
                        {headingBlock && (this.props.size != 'small') && headingBlock.heading ? <Heading data={headingBlock} /> : null}
                    </section>
                )
            }
        } return null
    }
}

MosaicTile.propTypes = dataPropTypes(tilePropTypes);


export default MosaicTile;
