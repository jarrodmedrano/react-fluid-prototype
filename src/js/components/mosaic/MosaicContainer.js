import React from 'react';
import MosaicTile from './MosaicTile';
import propsAreValid from '../../util';
import tilePropTypes from '../../../data/dataProps';
import dataPropTypes from '../../../data/dataProps';

let myTile =  {
    "heading": "-- mosaic title 1 --",
    "subheading": "-- mosaic subtitle 1 --",
    "button": {
        "layout": "link",
        "path": "http://www.microsoft.com",
        "title": "Call to action",
        "textColor": "white",
        "backgroundColor": "blue"
    },
    "size": "1",
    "pictures": [
        {
            "src": "http://placehold.it/890x800/171717/2F2F2F",
            "minwidth": "(min-width:1779px)"
        },
        {
            "src": "http://placehold.it/800x800/171717/2F2F2F",
            "minwidth": "(min-width:1400px)"
        },
        {
            "src": "http://placehold.it/700x800/171717/2F2F2F",
            "minwidth": "(min-width:1084px)"
        },
        {
            "src": "http://placehold.it/1083x400/171717/2F2F2F",
            "minwidth": "(min-width:768px)"
        },
        {
            "src": "http://placehold.it/768x400/171717/2F2F2F",
            "minwidth": "(min-width:540px)"
        },
        {
            "src": "http://placehold.it/540x300/171717/2F2F2F",
            "minwidth": "(min-width:0)"
        }
    ]
};

class MosaicContainer extends React.Component {
    render() {
        // TODO generate these layouts without all this markup
        if(propsAreValid(this.props.data)) {
            let {tiles, layout, theme} = this.props.data;
            if (tiles.length === 2 && layout === "layout-1" || tiles.length === 2) {
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
            } else if (tiles.length === 4 && layout === "layout-2") {
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
            } else if (tiles.length === 7 && layout === "layout-3" || tiles.length === 7) {
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
                                    <MosaicTile data={tiles[4]}/>
                                </div>
                                <div className={theme} data-f-mosaic="f-vp1-half f-height-small">
                                    <MosaicTile data={tiles[5]}/>
                                </div>
                                <div className={theme} data-f-mosaic="f-vp1-whole f-height-small">
                                    <MosaicTile data={tiles[6]}/>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            } else if (tiles.length === 6 && layout === "layout-4" || tiles.length === 6) {
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
                            <div className={theme} data-f-mosaic="f-vp1-whole f-vp4-half f-height-medium">
                                <MosaicTile data={tiles[5]}/>
                            </div>
                        </div>
                    </div>
                )
            } else if (tiles.length === 8 && layout === "layout-5" || tiles.length === 8) {
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
                                        <MosaicTile data={tiles[5]}/>
                                    </div>
                                    <div className={theme} data-f-mosaic="f-vp1-half f-height-small">
                                        <MosaicTile data={tiles[6]}/>
                                    </div>
                                    <div className={theme} data-f-mosaic="f-vp1-whole f-height-small">
                                        <MosaicTile data={tiles[7]}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            } else if (tiles.length === 9 && layout === "layout-6" || tiles.length >= 9) {
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
                                        <MosaicTile data={tiles[6]}/>
                                    </div>
                                    <div className={theme} data-f-mosaic="f-vp1-half f-height-small">
                                        <MosaicTile data={tiles[7]}/>
                                    </div>
                                    <div className={theme} data-f-mosaic="f-vp1-whole f-height-small">
                                        <MosaicTile data={tiles[8]}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            } else if (tiles.length === 4 && layout === "layout-7") {
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
            } else if (tiles.length === 3 && layout === "layout-8") {
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
            } else if (tiles.length === 3 && layout === "layout-9" || tiles.length === 3) {
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
            } else if (tiles.length === 4 && layout === "layout-10" || tiles.length === 4) {
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
