import React from 'react';
import classNames from 'classnames';
import MosaicTile from './MosaicTile';
import propsAreValid from '../../../../../lib/util';
import containerPropTypes from '../../../../../../data/dataProps';
import dataPropTypes from '../../../../../../data/dataProps';

class MosaicContainer extends React.Component {

    shouldComponentUpdate(nextProps) {
        if(this.props.data !== nextProps.data) {
            return true;
        }
        return false;
    }

    render() {
        // TODO generate these layouts without all this markup
        if (propsAreValid(this.props.data, this)) {
            let {tiles, theme} = this.props.data;

            let tileClass = classNames(
                theme ? theme : '',
                'c-mosaic fullscreen-mosaic');

            switch (tiles.length) {
                case 2: {
                    return ( // Default 2 tile layout "mosaic-1"
                        <div className={tileClass}>
                            {renderTile(tiles[0], vp1Wholevp4HalfLarge)}
                            {renderTile(tiles[1], vp1Wholevp4HalfLarge)}
                        </div>
                    );
                }
                case 3: {// Default 3 tile layout "mosaic-8"
                    {
                        return (
                            <div className={tileClass}>
                                {renderTile(tiles[0], vp1Wholevp4HalfLarge)}
                                <div data-f-mosaic="f-vp1-whole f-vp4-half">
                                    {renderTile(tiles[1], vp1Wholevp2WholeMedium)}
                                    {renderTile(tiles[2], vp1Wholevp2WholeMedium)}
                                </div>
                            </div>
                        )
                    }
                }
                case 4: {
                    return (
                        <div className={tileClass}>
                            <div data-f-mosaic="f-vp1-whole f-vp4-half">
                                {renderTile(tiles[0], vp1Wholevp4HalfLarge)}
                                {renderTile(tiles[1], vp1Wholevp4HalfLarge)}
                            </div>
                            <div data-f-mosaic="f-vp1-whole f-vp4-half">
                                {renderTile(tiles[2], vp1Wholevp4HalfLarge)}
                                {renderTile(tiles[3], vp1Wholevp4HalfLarge)}
                            </div>
                        </div>
                    );
                }
                case 5: {
                    // Default layout for 5 tiles "mosaic-3"
                    return (
                        <div className={tileClass}>
                            {renderTile(tiles[0], vp1Wholevp4HalfMedium)}
                            {renderTile(tiles[1], vp1Wholevp4HalfMedium)}
                            {renderTile(tiles[2], vp1Wholevp4HalfMedium)}
                            <div data-f-mosaic="f-vp1-whole f-vp4-half">
                                {renderTile(tiles[3], vp1Wholevp2HalfMedium)}
                                {renderTile(tiles[4], vp1Wholevp2HalfMedium)}
                            </div>
                        </div>
                    )
                }
                case 6: {
                    // Default layout for 6 tiles "mosaic-4"
                    return (
                        <div className={tileClass}>
                            {renderTile(tiles[0], vp1Wholevp4HalfMedium)}
                            <div data-f-mosaic="f-vp1-whole f-vp4-half">
                                {renderTile(tiles[1], vp1Wholevp2HalfMedium)}
                                {renderTile(tiles[2], vp1Wholevp2HalfMedium)}
                            </div>
                            <div data-f-mosaic="f-vp1-whole f-vp4-half">
                                {renderTile(tiles[3], vp1Wholevp2HalfMedium)}
                                {renderTile(tiles[4], vp1Wholevp2HalfMedium)}
                            </div>
                            {renderTile(tiles[5], vp1Wholevp4HalfMedium)}
                        </div>
                    )
                }
                case 7: {
                    // Default layout for 7 tiles "mosaic-3"
                    return (
                        <div className={tileClass}>
                            {renderTile(tiles[0], vp1Wholevp4HalfMedium)}
                            <div data-f-mosaic="f-vp1-whole f-vp4-half">
                                {renderTile(tiles[1], vp1Wholevp2HalfMedium)}
                                {renderTile(tiles[2], vp1Wholevp2HalfMedium)}
                            </div>
                            <div data-f-mosaic="f-vp1-whole f-vp4-half">
                                {renderTile(tiles[3], vp1Wholevp2HalfMedium)}
                                {renderTile(tiles[4], vp1Wholevp2HalfMedium)}
                            </div>
                            <div data-f-mosaic="f-vp1-whole f-vp4-half">
                                {renderTile(tiles[5], vp1Wholevp2HalfMedium)}
                                {renderTile(tiles[6], vp1Wholevp2HalfMedium)}
                            </div>
                        </div>
                    );
                }
                case 8: {
                    // Default layout for 8 tiles "mosaic-5"
                    return (
                        <div className={tileClass}>
                            <div data-f-mosaic="f-vp1-whole f-vp4-half">
                                {renderTile(tiles[0], vp1Wholevp2HalfMedium)}
                                {renderTile(tiles[1], vp1Wholevp2HalfMedium)}
                            </div>
                            <div data-f-mosaic="f-vp1-whole f-vp4-half">
                                {renderTile(tiles[2], vp1Wholevp2HalfMedium)}
                                {renderTile(tiles[3], vp1Wholevp2HalfMedium)}
                            </div>
                            <div data-f-mosaic="f-vp1-whole f-vp4-half">
                                {renderTile(tiles[4], vp1Wholevp2HalfMedium)}
                                {renderTile(tiles[5], vp1Wholevp2HalfMedium)}
                            </div>
                            <div data-f-mosaic="f-vp1-whole f-vp4-half">
                                {renderTile(tiles[6], vp1Wholevp2HalfMedium)}
                                {renderTile(tiles[7], vp1Wholevp2HalfMedium)}
                            </div>
                        </div>
                    );
                }
                case 9: {
                    // Default layout for 9 tiles "mosaic-6"
                    return (
                        <div className={tileClass}>
                            <div data-f-mosaic="f-vp1-whole f-vp4-whole f-height-large">
                                {renderTile(tiles[0], vp1Wholevp4HalfMedium)}
                                <div data-f-mosaic="f-vp1-whole f-vp4-half f-height-medium">
                                    {renderTile(tiles[1], vp1Wholevp2HalfMedium)}
                                    {renderTile(tiles[2], vp1Wholevp2HalfMedium)}
                                </div>
                                <div data-f-mosaic="f-vp1-whole f-vp4-half f-height-medium">
                                    {renderTile(tiles[3], vp1Wholevp2HalfMedium)}
                                    {renderTile(tiles[4], vp1Wholevp2HalfMedium)}
                                </div>
                                <div data-f-mosaic="f-vp1-whole f-vp4-half f-height-medium">
                                    {renderTile(tiles[5], vp1Wholevp2HalfMedium)}
                                    <div data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                        {renderTile(tiles[6], vp1HalfSmall)}
                                        {renderTile(tiles[7], vp1HalfSmall)}
                                        {renderTile(tiles[8], vp1HalfSmall)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }
                default: {
                    return (
                        <div className={tileClass}>
                            <div className={tileClass} data-f-mosaic="f-vp1-whole f-vp4-whole f-height-large">
                                {tiles.map(function (result, id) {
                                    return (
                                        <div className={tileClass}
                                             data-f-mosaic="f-vp1-whole f-vp2-whole f-height-large"
                                             key={id}>
                                            <MosaicTile data={result}/>
                                        </div>
                                    )
                                }, this) }
                            </div>
                        </div>
                    )
                }
            }
        }
        return null
    }
}


const vp1Wholevp2HalfMedium = 'f-vp1-whole f-vp2-half f-height-medium';

const vp1Wholevp4HalfMedium = 'f-vp1-whole f-vp4-half f-height-medium';

const vp1Wholevp4HalfLarge = 'f-vp1-whole f-vp4-half f-height-large';

const vp1Wholevp2WholeMedium = 'f-vp1-whole f-vp2-whole f-height-medium';

const vp1HalfSmall = 'f-vp1-half f-height-small';

const renderTile = (tileData, tileSize) => {
    let {theme} = tileData;

    return (
        <div className={classNames(theme)} data-f-mosaic={tileSize}>
            <MosaicTile data={tileData}/>
        </div>
    )
};

MosaicContainer.defaultProps = {
    tiles: []
};

MosaicContainer.propTypes = dataPropTypes(containerPropTypes);

export default MosaicContainer;
