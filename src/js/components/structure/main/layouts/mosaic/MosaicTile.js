import React from 'react';
import classNames from 'classnames';
import MosaicPicture from '../../../../generic/picture/MosaicPicture';
import Heading from '../../../../generic/heading/Heading';
import ButtonLink from '../../../../generic/link/ButtonLink'
import propsAreValid from '../../../../../lib/util';
import dataPropTypes, {tilePropTypes} from '../../../../../../data/dataProps';

class MosaicTile extends React.Component {
    shouldComponentUpdate(nextProps) {
        if(this.props.data !== nextProps.data) {
            return true;
        }
        return false;
    }

    render() {
        if(propsAreValid(this.props.data, this)) {
            const {headingBlock, pictureBlock, hoverEffectColor, viewMask, theme, alignX, alignY, textColor, backgroundColor} = this.props.data;

            const tileClass = classNames('c-mosaic-placement c-placement f-height-large f-width-small',
                theme ? theme : '',
                viewMask ? `f-mask-${viewMask}` : '',
                alignX ? `x-type-${alignX}` : '',
                alignY ? `f-y-${alignY}` : '',
            );

            const tileStyle = {
                background: backgroundColor,
                color: textColor
            };

            if(headingBlock) {
                const {button} = headingBlock;
                const headingAlign = Object.assign(headingBlock, ...headingBlock, { alignX, alignY });

                if(button) {
                    const {link} = button;
                    return (
                        <ButtonLink to={link} layout="mosaic">
                            <section className={tileClass} style={tileStyle}>
                                {hoverEffectColor ? <div className="c-image-overlay" aria-hidden="true" style={{backgroundColor: hoverEffectColor}} /> : null }
                                {pictureBlock ? <MosaicPicture data={pictureBlock} /> : null}
                                <Heading data={headingAlign} nobutton />
                            </section>
                        </ButtonLink>
                    )
                } else {
                    return (
                        <section className={tileClass} style={tileStyle}>
                            {pictureBlock ? <MosaicPicture data={pictureBlock} /> : null}
                            <Heading data={headingAlign} />
                        </section>
                    )
                }
            } else {
                return (
                    <section className={tileClass} style={tileStyle}>
                        {pictureBlock ? <MosaicPicture data={pictureBlock} /> : null}
                    </section>
                )
            }
        } return null
    }
}

MosaicTile.propTypes = dataPropTypes(tilePropTypes);


export default MosaicTile;
