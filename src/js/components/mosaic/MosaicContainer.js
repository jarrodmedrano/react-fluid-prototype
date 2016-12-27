import React from 'react';
import MosaicTile from './MosaicTile';
import propsAreValid from '../../util';
import tilePropTypes from '../../../data/dataProps';
import dataPropTypes from '../../../data/dataProps';

class MosaicContainer extends React.Component {
    render() {
        // TODO generate these layouts without all this markup
        if(propsAreValid(this.props.data)) {
            let {tiles, layout, theme} = this.props.data;
            if (tiles.length === 2 && layout === "mosaic-1" || tiles.length === 2) {
                return (
                    <div className="c-mosaic  fullscreen-mosaic">
                        <div className={theme} data-f-mosaic="f-vp1-whole f-vp4-half f-height-large">
                            <MosaicTile data={tiles[0]}/>
                        </div>
                        <div className={theme} data-f-mosaic="f-vp1-whole f-vp4-half f-height-large">
                            <MosaicTile data={tiles[1]}/>
                        </div>
                    </div>
                );
            } else if (tiles.length === 4 && layout === "mosaic-2") {
                return (
                    <div className="c-mosaic  fullscreen-mosaic">
                        <div className={theme} data-f-mosaic="f-vp1-whole f-vp4-half f-height-large">
                            <MosaicTile data={tiles[0]}/>
                        </div>
                        <div data-f-mosaic="f-vp1-whole f-vp4-half f-height-large">
                            <div className={theme} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                <MosaicTile data={tiles[1]}/>
                            </div>
                            <div className={theme} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                <MosaicTile data={tiles[2]}/>
                            </div>
                            <div className={theme} data-f-mosaic="f-vp1-whole f-height-medium">
                                <MosaicTile data={tiles[3]}/>
                            </div>
                        </div>
                    </div>
                );
            } else if (tiles.length === 7 && layout === "mosaic-3" || tiles.length === 7) {
                return (
                    <div className="c-mosaic fullscreen-mosaic">
                        <div className={theme} data-f-mosaic="f-vp1-whole f-vp4-half f-height-large">
                                <MosaicTile data={tiles[0]} />
                        </div>
                        <div data-f-mosaic="f-vp1-whole f-vp4-half f-height-large">
                            <div className={theme} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                <MosaicTile data={tiles[1]}/>
                            </div>
                            <div className={theme} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                <MosaicTile data={tiles[2]}/>
                            </div>
                            <div className={theme} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                <MosaicTile data={tiles[3]}/>
                            </div>
                            <div data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                <div className={theme} data-f-mosaic="f-vp1-half f-height-small">
                                    <MosaicTile data={tiles[4]} size="small" />
                                </div>
                                <div className={theme} data-f-mosaic="f-vp1-half f-height-small">
                                    <MosaicTile data={tiles[5]} size="small" />
                                </div>
                                <div className={theme} data-f-mosaic="f-vp1-whole f-height-small">
                                    <MosaicTile data={tiles[6]} />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            } else if (tiles.length === 6 && layout === "mosaic-4" || tiles.length === 6) {
                return (
                    <div className="c-mosaic fullscreen-mosaic">
                        <div data-f-mosaic="f-vp1-whole f-vp4-whole f-height-large">
                            <div className={theme} data-f-mosaic="f-vp1-whole f-vp4-half f-height-medium">
                                <MosaicTile data={tiles[0]}/>
                            </div>
                            <div data-f-mosaic="f-vp1-whole f-vp4-half f-height-medium">
                                <div className={theme} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                    <MosaicTile data={tiles[1]}/>
                                </div>
                                <div className={theme} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                    <MosaicTile data={tiles[2]}/>
                                </div>
                            </div>
                            <div data-f-mosaic="f-vp1-whole f-vp4-half f-height-medium">
                                <div className={theme} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                    <MosaicTile data={tiles[3]}/>
                                </div>
                                <div className={theme} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                    <MosaicTile data={tiles[4]}/>
                                </div>
                            </div>
                            <div className={theme} data-f-mosaic="f-vp1-whole f-vp4-half f-height-medium">
                                <MosaicTile data={tiles[5]}/>
                            </div>
                        </div>
                    </div>
                )
            } else if (tiles.length === 8 && layout === "mosaic-5" || tiles.length === 8) {
                return (
                    <div className="c-mosaic fullscreen-mosaic">
                        <div data-f-mosaic="f-vp1-whole f-vp4-whole f-height-large">
                            <div className={theme} data-f-mosaic="f-vp1-whole f-vp4-half f-height-medium">
                                <MosaicTile data={tiles[0]}/>
                            </div>
                            <div data-f-mosaic="f-vp1-whole f-vp4-half f-height-medium">
                                <div className={theme} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                    <MosaicTile data={tiles[1]}/>
                                </div>
                                <div className={theme} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                    <MosaicTile data={tiles[2]}/>
                                </div>
                            </div>
                            <div className={theme} data-f-mosaic="f-vp1-whole f-vp4-half f-height-medium">
                                <MosaicTile data={tiles[3]}/>
                            </div>
                            <div data-f-mosaic="f-vp1-whole f-vp4-half f-height-medium">
                                <div className={theme} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                    <MosaicTile data={tiles[4]}/>
                                </div>
                                <div data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                    <div className={theme} data-f-mosaic="f-vp1-half f-height-small">
                                        <MosaicTile data={tiles[5]} size="small" />
                                    </div>
                                    <div className={theme} data-f-mosaic="f-vp1-half f-height-small">
                                        <MosaicTile data={tiles[6]} size="small" />
                                    </div>
                                    <div className={theme} data-f-mosaic="f-vp1-whole f-height-small">
                                        <MosaicTile data={tiles[7]} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            } else if (tiles.length === 9 && layout === "mosaic-6" || tiles.length >= 9) {
                return (
                    <div className="c-mosaic  fullscreen-mosaic">
                        <div data-f-mosaic="f-vp1-whole f-vp4-whole f-height-large">
                            <div className={theme} data-f-mosaic="f-vp1-whole f-vp4-half f-height-medium">
                                <MosaicTile data={tiles[0]}/>
                            </div>
                            <div data-f-mosaic="f-vp1-whole f-vp4-half f-height-medium">
                                <div className={theme} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                    <MosaicTile data={tiles[1]}/>
                                </div>
                                <div className={theme} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                    <MosaicTile data={tiles[2]}/>
                                </div>
                            </div>
                            <div data-f-mosaic="f-vp1-whole f-vp4-half f-height-medium">
                                <div className={theme} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                    <MosaicTile data={tiles[3]}/>
                                </div>
                                <div className={theme} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                    <MosaicTile data={tiles[4]}/>
                                </div>
                            </div>
                            <div data-f-mosaic="f-vp1-whole f-vp4-half f-height-medium">
                                <div className={theme} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                    <MosaicTile data={tiles[5]}/>
                                </div>
                                <div data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                    <div className={theme} data-f-mosaic="f-vp1-half f-height-small">
                                        <MosaicTile data={tiles[6]} size="small" />
                                    </div>
                                    <div className={theme} data-f-mosaic="f-vp1-half f-height-small">
                                        <MosaicTile data={tiles[7]} size="small" />
                                    </div>
                                    <div className={theme} data-f-mosaic="f-vp1-whole f-height-small">
                                        <MosaicTile data={tiles[8]} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            } else if (tiles.length === 4 && layout === "mosaic-7") {
                return (
                    <div className="c-mosaic  fullscreen-mosaic">
                        <div data-f-mosaic="f-vp1-whole f-vp4-half f-height-large">
                            <div className={theme} data-f-mosaic="f-vp1-whole f-vp2-half f-height-large">
                                <MosaicTile data={tiles[0]}/>
                            </div>
                            <div className={theme} data-f-mosaic="f-vp1-whole f-vp2-half f-height-large">
                                <MosaicTile data={tiles[1]}/>
                            </div>
                        </div>
                        <div data-f-mosaic="f-vp1-whole f-vp4-half f-height-large">
                            <div className={theme} data-f-mosaic="f-vp1-whole f-vp2-half f-height-large">
                                <MosaicTile data={tiles[2]}/>
                            </div>
                            <div className={theme} data-f-mosaic="f-vp1-whole f-vp2-half f-height-large">
                                <MosaicTile data={tiles[3]}/>
                            </div>
                        </div>
                    </div>
                );
            } else if (tiles.length === 3 && layout === "mosaic-8") {
                return (
                    <div className="c-mosaic  fullscreen-mosaic">
                        <div data-f-mosaic="f-vp1-whole f-vp4-whole f-height-large">
                            <div className={theme} data-f-mosaic="f-vp1-whole f-vp4-half f-height-large">
                                <MosaicTile data={tiles[0]}/>
                            </div>
                            <div data-f-mosaic="f-vp1-whole f-vp4-half f-height-large">
                                <div className={theme} data-f-mosaic="f-vp1-whole f-vp2-half f-height-large">
                                    <MosaicTile data={tiles[1]}/>
                                </div>
                                <div className={theme} data-f-mosaic="f-vp1-whole f-vp2-half f-height-large">
                                    <MosaicTile data={tiles[2]}/>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            } else if (tiles.length === 3 && layout === "mosaic-9" || tiles.length === 3) {
                return (
                    <div className="c-mosaic  fullscreen-mosaic">
                        <div data-f-mosaic="f-vp1-whole f-vp4-half f-height-large">
                            <div className={theme} data-f-mosaic="f-vp1-whole f-vp2-half f-height-large">
                                <MosaicTile data={tiles[0]}/>
                            </div>
                            <div className={theme} data-f-mosaic="f-vp1-whole f-vp2-half f-height-large">
                                <MosaicTile data={tiles[1]}/>
                            </div>
                        </div>
                        <div className={theme} data-f-mosaic="f-vp1-whole f-vp4-half f-height-large">
                            <MosaicTile data={tiles[2]}/>
                        </div>
                    </div>
                )
            } else if (tiles.length === 4 && layout === "mosaic-10" || tiles.length === 4) {
                return (
                    <div className="c-mosaic  fullscreen-mosaic">
                        <div data-f-mosaic="f-vp1-whole f-vp4-half f-height-large">
                            <div className={theme} data-f-mosaic="f-vp1-whole f-vp2-half f-height-large">
                                <MosaicTile data={tiles[0]}/>
                            </div>
                            <div className={theme} data-f-mosaic="f-vp1-whole f-vp2-half f-height-large">
                                <MosaicTile data={tiles[1]}/>
                            </div>
                        </div>
                        <div data-f-mosaic="f-vp1-whole f-vp4-half f-height-large">
                            <div className={theme} data-f-mosaic="f-vp1-whole f-vp2-half f-height-large">
                                <MosaicTile data={tiles[2]}/>
                            </div>
                            <div className={theme} data-f-mosaic="f-vp1-whole f-vp2-half f-height-large">
                                <MosaicTile data={tiles[3]}/>
                            </div>
                        </div>
                    </div>
                );
            } else {
                return (
                    <div className="c-mosaic fullscreen-mosaic">
                        {tiles.map(function (result, id) {
                            return (
                                <div className={theme} data-f-mosaic="f-vp1-whole f-vp4-whole f-height-large" key={id}>
                                    <MosaicTile data={result}/>
                                </div>
                            )
                        })}
                    </div>
                )
            }
        } return null
    }
}

MosaicContainer.defaultProps = {
    tiles: []
};

MosaicContainer.propTypes = dataPropTypes(tilePropTypes);

export default MosaicContainer;
