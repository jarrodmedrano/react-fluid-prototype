import React from 'react';
import MosaicTile from './MosaicTile';

class MosaicContainer extends React.Component {
    render() {

        let {tiles, layout, theme} = this.props.data;

        // TODO generate these layouts without all this markup

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
                            <MosaicTile data={tiles[1]} />
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
    }
}

export default MosaicContainer;