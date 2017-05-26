import React from 'react';
import classNames from 'classnames';
import MosaicPicture from '../../../../generic/picture/MosaicPicture';
import Heading from '../../../../generic/heading/Heading';
import ButtonLink from '../../../../generic/link/ButtonLink'
import propsAreValid from '../../../../../lib/util';
import dataPropTypes, {tilePropTypes} from '../../../../../../data/dataProps';

class MosaicTile extends React.Component {
    render() {
        if(propsAreValid(this.props.data, this)) {
            let { headingBlock, pictureBlock, hoverEffectColor, viewMask, theme, alignX} = this.props.data;
            let { textColor, backgroundColor } = headingBlock;

            let tileClass = classNames('c-mosaic-placement c-placement f-height-large f-width-small',
                theme ? theme : 'theme-dark',
                viewMask ? `f-mask-${viewMask}` : '',
                alignX ? `x-type-${alignX}` : ''
            );

            let tileStyle = {
                background: backgroundColor,
                color: textColor
            };

            if(headingBlock.button) {
                return (
                    <ButtonLink to={headingBlock.button.link} layout="mosaic">
                        <section className={tileClass} style={tileStyle}>
                            {hoverEffectColor ? <div className="c-image-overlay" aria-hidden="true" style={{backgroundColor: hoverEffectColor}} /> : null }
                            {pictureBlock ? <MosaicPicture data={pictureBlock} /> : null}
                            {headingBlock && (this.props.size !== 'small') && headingBlock.heading ? <Heading data={headingBlock} /> : null}
                        </section>
                    </ButtonLink>
                )
            } else {
                return (
                    <section className={tileClass}>
                        {pictureBlock ? <MosaicPicture data={pictureBlock} /> : null}
                        {headingBlock && (this.props.size !== 'small') && headingBlock.heading ? <Heading data={headingBlock} /> : null}
                    </section>
                )
            }
        } return null
    }
}

MosaicTile.propTypes = dataPropTypes(tilePropTypes);


export default MosaicTile;
