import React from 'react';
import classNames from 'classnames';
import MosaicTile from './MosaicTile';
import propsAreValid from '../../lib/util';
import containerPropTypes from '../../../data/dataProps';
import dataPropTypes from '../../../data/dataProps';

class MosaicContainer extends React.Component {
    render() {
        // TODO generate these layouts without all this markup
        if (propsAreValid(this.props.data, this)) {
            let {tiles, mosaicLayout, theme, viewMask} = this.props.data;

            let tileClass = classNames(
                theme ? theme : 'theme-light',
                'c-mosaic fullscreen-mosaic');


            switch (tiles.length) {
                case 2: {
                    return ( // Default 2 tile layout "mosaic-1"
                        <div className={tileClass}>
                            <div data-f-mosaic="f-vp1-whole f-vp4-half f-height-large">
                                <MosaicTile data={tiles[0]} theme={theme} />
                            </div>
                            <div data-f-mosaic="f-vp1-whole f-vp4-half f-height-large">
                                <MosaicTile data={tiles[1]} theme={theme} />
                            </div>
                        </div>
                    );
                }
                case 3: {// Default 3 tile layout "mosaic-8"
                    {
                        return (
                            <div className={tileClass}>
                                <div className={tileClass} data-f-mosaic="f-vp1-whole f-vp4-half f-height-large">
                                    <MosaicTile data={tiles[0]} theme={theme} />
                                </div>
                                <div data-f-mosaic="f-vp1-whole f-vp4-half">
                                    <div className={tileClass} data-f-mosaic="f-vp1-whole f-vp2-whole f-height-medium">
                                        <MosaicTile data={tiles[1]} theme={theme} />
                                    </div>
                                    <div className={tileClass} data-f-mosaic="f-vp1-whole f-vp2-whole f-height-medium">
                                        <MosaicTile data={tiles[2]} theme={theme} />
                                    </div>
                                </div>
                            </div>
                        )
                    }
                }
                case 4: {
                    return (
                        <div className={tileClass}>
                            <div className={tileClass} data-f-mosaic="f-vp1-whole f-vp4-half f-height-large">
                                <MosaicTile data={tiles[0]}/>
                            </div>
                            <div data-f-mosaic="f-vp1-whole f-vp4-half f-height-large">
                                <div className={tileClass} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                    <MosaicTile data={tiles[1]} theme={theme} />
                                </div>
                                <div className={tileClass} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                    <MosaicTile data={tiles[2]} theme={theme} />
                                </div>
                                <div className={tileClass} data-f-mosaic="f-vp1-whole f-height-medium">
                                    <MosaicTile data={tiles[3]} theme={theme} />
                                </div>
                            </div>
                        </div>
                    );
                }
                case 5: {
                    // Default layout for 5 tiles "mosaic-3"
                    return (
                        <div className={tileClass}>
                            <div className={tileClass} data-f-mosaic="f-vp1-whole f-vp4-half f-height-medium">
                                <MosaicTile data={tiles[0]} theme={theme} />
                            </div>
                            <div data-f-mosaic="f-vp1-whole f-vp4-half">
                                <div className={tileClass} data-f-mosaic="f-vp1-whole f-vp2-whole f-height-medium">
                                    <MosaicTile data={tiles[1]} theme={theme} />
                                </div>
                            </div>
                            <div data-f-mosaic="f-vp1-whole f-vp4-half">
                                <div className={tileClass} data-f-mosaic="f-vp1-whole f-vp2-whole f-height-medium">
                                    <MosaicTile data={tiles[2]} theme={theme} />
                                </div>
                            </div>
                            <div data-f-mosaic="f-vp1-whole f-vp4-half">
                                <div className={tileClass} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                    <MosaicTile data={tiles[3]} theme={theme} />
                                </div>
                                <div className={tileClass} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                    <MosaicTile data={tiles[4]} theme={theme} />
                                </div>
                            </div>
                        </div>
                    )
                }
                case 6: {
                    // Default layout for 6 tiles "mosaic-4"
                    return (
                        <div className={tileClass}>
                            <div data-f-mosaic="f-vp1-whole f-vp4-whole f-height-large">
                                <div className={tileClass} data-f-mosaic="f-vp1-whole f-vp4-half f-height-medium">
                                    <MosaicTile data={tiles[0]} theme={theme} />
                                </div>
                                <div data-f-mosaic="f-vp1-whole f-vp4-half f-height-medium">
                                    <div className={tileClass} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                        <MosaicTile data={tiles[1]} theme={theme} />
                                    </div>
                                    <div className={tileClass} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                        <MosaicTile data={tiles[2]} theme={theme} />
                                    </div>
                                </div>
                                <div data-f-mosaic="f-vp1-whole f-vp4-half f-height-medium">
                                    <div className={tileClass} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                        <MosaicTile data={tiles[3]} theme={theme} />
                                    </div>
                                    <div className={tileClass} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                        <MosaicTile data={tiles[4]} theme={theme} />
                                    </div>
                                </div>
                                <div className={tileClass} data-f-mosaic="f-vp1-whole f-vp4-half f-height-medium">
                                    <MosaicTile data={tiles[5]} theme={theme} />
                                </div>
                            </div>
                        </div>
                    )
                }
                case 7: {
                    // Default layout for 7 tiles "mosaic-3"
                    return (
                        <div className={tileClass}>
                            <div data-f-mosaic="f-vp1-whole f-vp4-whole f-height-large">
                                <div className={tileClass} data-f-mosaic="f-vp1-whole f-vp4-half f-height-medium">
                                    <MosaicTile data={tiles[0]} theme={theme} />
                                </div>
                                <div data-f-mosaic="f-vp1-whole f-vp4-half f-height-medium">
                                    <div className={tileClass} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                        <MosaicTile data={tiles[1]} theme={theme} />
                                    </div>
                                    <div className={tileClass} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                        <MosaicTile data={tiles[2]} theme={theme} />
                                    </div>
                                </div>
                                <div data-f-mosaic="f-vp1-whole f-vp4-half f-height-medium">
                                    <div className={tileClass} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                        <MosaicTile data={tiles[3]} theme={theme} />
                                    </div>
                                    <div className={tileClass} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                        <MosaicTile data={tiles[4]} theme={theme} />
                                    </div>
                                </div>
                                <div className={tileClass} data-f-mosaic="f-vp1-whole f-vp4-half f-height-medium">
                                    <div className={tileClass} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                        <MosaicTile data={tiles[5]} theme={theme} />
                                    </div>
                                    <div className={tileClass} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                        <MosaicTile data={tiles[6]} theme={theme} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }
                case 8: {
                    // Default layout for 8 tiles "mosaic-5"
                    return (
                        <div className={tileClass}>
                            <div data-f-mosaic="f-vp1-whole f-vp4-whole f-height-large">
                                <div className={tileClass} data-f-mosaic="f-vp1-whole f-vp4-half f-height-medium">
                                    <div className={tileClass} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                        <MosaicTile data={tiles[0]} theme={theme} />
                                    </div>
                                    <div className={tileClass} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                        <MosaicTile data={tiles[1]} theme={theme} />
                                    </div>
                                </div>
                                <div data-f-mosaic="f-vp1-whole f-vp4-half f-height-medium">
                                    <div className={tileClass} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                        <MosaicTile data={tiles[2]} theme={theme} />
                                    </div>
                                    <div className={tileClass} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                        <MosaicTile data={tiles[3]} theme={theme} />
                                    </div>
                                </div>
                                <div data-f-mosaic="f-vp1-whole f-vp4-half f-height-medium">
                                    <div className={tileClass} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                        <MosaicTile data={tiles[4]} theme={theme} />
                                    </div>
                                    <div className={tileClass} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                        <MosaicTile data={tiles[5]} theme={theme} />
                                    </div>
                                </div>
                                <div className={tileClass} data-f-mosaic="f-vp1-whole f-vp4-half f-height-medium">
                                    <div className={tileClass} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                        <MosaicTile data={tiles[6]} theme={theme} />
                                    </div>
                                    <div className={tileClass} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                        <MosaicTile data={tiles[7]} theme={theme} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }
                case 9: {
                    // Default layout for 9 tiles "mosaic-6"
                    return (
                        <div className={tileClass}>
                            <div data-f-mosaic="f-vp1-whole f-vp4-whole f-height-large">
                                <div className={tileClass} data-f-mosaic="f-vp1-whole f-vp4-half f-height-medium">
                                    <MosaicTile data={tiles[0]} theme={theme} />
                                </div>
                                <div data-f-mosaic="f-vp1-whole f-vp4-half f-height-medium">
                                    <div className={tileClass} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                        <MosaicTile data={tiles[1]} theme={theme} />
                                    </div>
                                    <div className={tileClass} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                        <MosaicTile data={tiles[2]} theme={theme} />
                                    </div>
                                </div>
                                <div data-f-mosaic="f-vp1-whole f-vp4-half f-height-medium">
                                    <div className={tileClass} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                        <MosaicTile data={tiles[3]} theme={theme} />
                                    </div>
                                    <div className={tileClass} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                        <MosaicTile data={tiles[4]} theme={theme} />
                                    </div>
                                </div>
                                <div data-f-mosaic="f-vp1-whole f-vp4-half f-height-medium">
                                    <div className={tileClass} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                        <MosaicTile data={tiles[5]} theme={theme} />
                                    </div>
                                    <div data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                        <div className={tileClass} data-f-mosaic="f-vp1-half f-height-small">
                                            <MosaicTile data={tiles[6]} size="small" theme={theme} />
                                        </div>
                                        <div className={tileClass} data-f-mosaic="f-vp1-half f-height-small">
                                            <MosaicTile data={tiles[7]} size="small" theme={theme} />
                                        </div>
                                        <div className={tileClass} data-f-mosaic="f-vp1-whole f-height-small">
                                            <MosaicTile data={tiles[8]}  theme={theme} />
                                        </div>
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
                                        <div className={tileClass} data-f-mosaic="f-vp1-whole f-vp2-whole f-height-large"
                                             key={id}>
                                                <MosaicTile data={result} theme={theme} />
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

MosaicContainer.defaultProps = {
    tiles: []
};

MosaicContainer.propTypes = dataPropTypes(containerPropTypes);

export default MosaicContainer;
