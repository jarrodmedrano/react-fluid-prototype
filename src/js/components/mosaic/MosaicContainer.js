import React from 'react';
import MosaicTile from './MosaicTile';
import propsAreValid from '../../lib/util';
import tilePropTypes from '../../../data/dataProps';
import dataPropTypes from '../../../data/dataProps';

class MosaicContainer extends React.Component {
    render() {
        // TODO generate these layouts without all this markup
        if (propsAreValid(this.props.data, this)) {
            let {tiles, mosaicLayout, theme} = this.props.data;
            switch (tiles.length) {
                case 2:
                    {
                        return ( // Default 2 tile layout "mosaic-1"
                            <div className="c-mosaic  fullscreen-mosaic">
                                <div className={theme} data-f-mosaic="f-vp1-whole f-vp4-half f-height-large">
                                    <MosaicTile data={tiles[0]}  />
                                </div>
                                <div className={theme} data-f-mosaic="f-vp1-whole f-vp4-half f-height-large">
                                    <MosaicTile data={tiles[1]}  />
                                </div>
                            </div>
                        );
                    }
                case 3:
                    {
                        switch (mosaicLayout) {
                            case "mosaic-8":
                                {
                                    return (
                                        <div className="c-mosaic  fullscreen-mosaic">
                                            <div data-f-mosaic="f-vp1-whole f-vp4-whole f-height-large">
                                                <div className={theme} data-f-mosaic="f-vp1-whole f-vp4-half f-height-large">
                                                    <MosaicTile data={tiles[0]} />
                                                </div>
                                                <div data-f-mosaic="f-vp1-whole f-vp4-half f-height-large">
                                                    <div className={theme} data-f-mosaic="f-vp1-whole f-vp2-half f-height-large">
                                                        <MosaicTile data={tiles[1]} />
                                                    </div>
                                                    <div className={theme} data-f-mosaic="f-vp1-whole f-vp2-half f-height-large">
                                                        <MosaicTile data={tiles[2]} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            default: // Default 3 tile layout "mosaic-9"
                                {
                                    return (
                                        <div className="c-mosaic  fullscreen-mosaic">
                                            <div data-f-mosaic="f-vp1-whole f-vp4-half f-height-large">
                                                <div className={theme} data-f-mosaic="f-vp1-whole f-vp2-half f-height-large">
                                                    <MosaicTile data={tiles[0]} />
                                                </div>
                                                <div className={theme} data-f-mosaic="f-vp1-whole f-vp2-half f-height-large">
                                                    <MosaicTile data={tiles[1]} />
                                                </div>
                                            </div>
                                            <div className={theme} data-f-mosaic="f-vp1-whole f-vp4-half f-height-large">
                                                <MosaicTile data={tiles[2]} />
                                            </div>
                                        </div>
                                    )
                                }
                        }
                    }
                case 4:
                    {
                        switch (mosaicLayout) {
                            case "mosaic-10":
                                {
                                    return (
                                        <div className="c-mosaic  fullscreen-mosaic">
                                            <div data-f-mosaic="f-vp1-whole f-vp4-half f-height-large">
                                                <div className={theme} data-f-mosaic="f-vp1-whole f-vp2-half f-height-large">
                                                    <MosaicTile data={tiles[0]} />
                                                </div>
                                                <div className={theme} data-f-mosaic="f-vp1-whole f-vp2-half f-height-large">
                                                    <MosaicTile data={tiles[1]} />
                                                </div>
                                            </div>
                                            <div data-f-mosaic="f-vp1-whole f-vp4-half f-height-large">
                                                <div className={theme} data-f-mosaic="f-vp1-whole f-vp2-half f-height-large">
                                                    <MosaicTile data={tiles[2]} />
                                                </div>
                                                <div className={theme} data-f-mosaic="f-vp1-whole f-vp2-half f-height-large">
                                                    <MosaicTile data={tiles[3]} />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                            case "mosaic-7":
                                {
                                    return (
                                        <div className="c-mosaic  fullscreen-mosaic">
                                            <div data-f-mosaic="f-vp1-whole f-vp4-half f-height-large">
                                                <div className={theme} data-f-mosaic="f-vp1-whole f-vp2-half f-height-large">
                                                    <MosaicTile data={tiles[0]} />
                                                </div>
                                                <div className={theme} data-f-mosaic="f-vp1-whole f-vp2-half f-height-large">
                                                    <MosaicTile data={tiles[1]} />
                                                </div>
                                            </div>
                                            <div data-f-mosaic="f-vp1-whole f-vp4-half f-height-large">
                                                <div className={theme} data-f-mosaic="f-vp1-whole f-vp2-half f-height-large">
                                                    <MosaicTile data={tiles[2]} />
                                                </div>
                                                <div className={theme} data-f-mosaic="f-vp1-whole f-vp2-half f-height-large">
                                                    <MosaicTile data={tiles[3]} />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                            default:
                                {
                                    return (
                                        <div className="c-mosaic  fullscreen-mosaic">
                                            <div className={theme} data-f-mosaic="f-vp1-whole f-vp4-half f-height-large">
                                                <MosaicTile data={tiles[0]}  />
                                            </div>
                                            <div data-f-mosaic="f-vp1-whole f-vp4-half f-height-large">
                                                <div className={theme} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                                    <MosaicTile data={tiles[1]}  />
                                                </div>
                                                <div className={theme} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                                    <MosaicTile data={tiles[2]}  />
                                                </div>
                                                <div className={theme} data-f-mosaic="f-vp1-whole f-height-medium">
                                                    <MosaicTile data={tiles[3]}  />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                        }
                    }
                case 5:
                    {
                        // Default layout for 5 tiles "mosaic-3"
                        return (
                            <div className="c-mosaic fullscreen-mosaic">
                                <div className="theme-dark" data-f-mosaic="f-vp1-whole f-vp4-half f-height-medium">
                                    <MosaicTile data={tiles[0]}  />
                                </div>
                                <div data-f-mosaic="f-vp1-whole f-vp4-half">
                                    <div className="theme-dark" data-f-mosaic="f-vp1-whole f-vp2-whole f-height-medium">
                                        <MosaicTile data={tiles[1]}  />
                                    </div>
                                </div>
                                <div data-f-mosaic="f-vp1-whole f-vp4-half">
                                    <div className="theme-dark" data-f-mosaic="f-vp1-whole f-vp2-whole f-height-medium">
                                        <MosaicTile data={tiles[2]}  />
                                    </div>
                                </div>
                                <div data-f-mosaic="f-vp1-whole f-vp4-half">
                                    <div className="theme-light" data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                        <MosaicTile data={tiles[3]}  />
                                    </div>
                                    <div className="theme-dark" data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                        <MosaicTile data={tiles[4]}  />
                                    </div>
                                </div>
                            </div>
                        )
                    }
                case 6:
                    {
                        // Default layout for 6 tiles "mosaic-4"
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
                    }
                case 7:
                    {
                        // Default layout for 7 tiles "mosaic-3"
                        return (
                            <div className="c-mosaic fullscreen-mosaic">
                                <div className={theme} data-f-mosaic="f-vp1-whole f-vp4-half f-height-large">
                                    <MosaicTile data={tiles[0]}  />
                                </div>
                                <div data-f-mosaic="f-vp1-whole f-vp4-half f-height-large">
                                    <div className={theme} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                        <MosaicTile data={tiles[1]}  />
                                    </div>
                                    <div className={theme} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                        <MosaicTile data={tiles[2]}  />
                                    </div>

                                    <div className={theme} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                        <MosaicTile data={tiles[3]}  />
                                    </div>
                                    <div data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                        <div className={theme} data-f-mosaic="f-vp1-half f-height-small">
                                            <MosaicTile data={tiles[4]} size="small"  />
                                        </div>
                                        <div className={theme} data-f-mosaic="f-vp1-half f-height-small">
                                            <MosaicTile data={tiles[5]} size="small"  />
                                        </div>
                                        <div className={theme} data-f-mosaic="f-vp1-whole f-height-small">
                                            <MosaicTile data={tiles[6]}  />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    }
                case 8:
                    {
                        // Default layout for 8 tiles "mosaic-5"
                        return (
                            <div className="c-mosaic fullscreen-mosaic">
                                <div data-f-mosaic="f-vp1-whole f-vp4-whole f-height-large">
                                    <div className={theme} data-f-mosaic="f-vp1-whole f-vp4-half f-height-medium">
                                        <MosaicTile data={tiles[0]} />
                                    </div>
                                    <div data-f-mosaic="f-vp1-whole f-vp4-half f-height-medium">
                                        <div className={theme} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                            <MosaicTile data={tiles[1]} />
                                        </div>
                                        <div className={theme} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                            <MosaicTile data={tiles[2]} />
                                        </div>
                                    </div>
                                    <div className={theme} data-f-mosaic="f-vp1-whole f-vp4-half f-height-medium">
                                        <MosaicTile data={tiles[3]} />
                                    </div>
                                    <div data-f-mosaic="f-vp1-whole f-vp4-half f-height-medium">
                                        <div className={theme} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                            <MosaicTile data={tiles[4]} />
                                        </div>
                                        <div data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                            <div className={theme} data-f-mosaic="f-vp1-half f-height-small">
                                                <MosaicTile data={tiles[5]} size="small"  />
                                            </div>
                                            <div className={theme} data-f-mosaic="f-vp1-half f-height-small">
                                                <MosaicTile data={tiles[6]} size="small"  />
                                            </div>
                                            <div className={theme} data-f-mosaic="f-vp1-whole f-height-small">
                                                <MosaicTile data={tiles[7]} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    }
                case 9:
                    {
                        // Default layout for 9 tiles "mosaic-6"
                        return (
                            <div className="c-mosaic  fullscreen-mosaic">
                                <div data-f-mosaic="f-vp1-whole f-vp4-whole f-height-large">
                                    <div className={theme} data-f-mosaic="f-vp1-whole f-vp4-half f-height-medium">
                                        <MosaicTile data={tiles[0]} />
                                    </div>
                                    <div data-f-mosaic="f-vp1-whole f-vp4-half f-height-medium">
                                        <div className={theme} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                            <MosaicTile data={tiles[1]} />
                                        </div>
                                        <div className={theme} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                            <MosaicTile data={tiles[2]} />
                                        </div>
                                    </div>
                                    <div data-f-mosaic="f-vp1-whole f-vp4-half f-height-medium">
                                        <div className={theme} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                            <MosaicTile data={tiles[3]} />
                                        </div>
                                        <div className={theme} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                            <MosaicTile data={tiles[4]} />
                                        </div>
                                    </div>
                                    <div data-f-mosaic="f-vp1-whole f-vp4-half f-height-medium">
                                        <div className={theme} data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                            <MosaicTile data={tiles[5]} />
                                        </div>
                                        <div data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                                            <div className={theme} data-f-mosaic="f-vp1-half f-height-small">
                                                <MosaicTile data={tiles[6]} size="small"  />
                                            </div>
                                            <div className={theme} data-f-mosaic="f-vp1-half f-height-small">
                                                <MosaicTile data={tiles[7]} size="small"  />
                                            </div>
                                            <div className={theme} data-f-mosaic="f-vp1-whole f-height-small">
                                                <MosaicTile data={tiles[8]}  />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    }
                default:
                    {
                        return (
                            <div className="c-mosaic fullscreen-mosaic">
                                {tiles.map(function (result, id) {
                                    return (
                                        <div className={theme} data-f-mosaic="f-vp1-whole f-vp4-whole f-height-large" key={id}>
                                            <MosaicTile data={result.data}  />
                                        </div>
                                    )
                                }, this) }
                            </div>
                        )
                    }
            }
        } return null
    }
}

MosaicContainer.defaultProps = {
    tiles: []
};

MosaicContainer.propTypes = dataPropTypes(tilePropTypes);

export default MosaicContainer;
