import React from 'react'
import 'src/js/components/mosaic/mosaic.scss!';

var Mosaic = React.createClass({

    render() {
        return(
            <div className="theme-dark" data-f-mosaic={this.props.mosaicSize}>
                <article className="c-placement context-music-album f-width-small f-height-large">
                    <picture>
                        <img srcSet="http://www.getmwf.com/images/components/placement-background-tombraider.jpg" src="http://www.getmwf.com/images/components/placement-background-tombraider.jpg" alt="Forza" />
                    </picture>

                    <div className="c-image-overlay" aria-hidden="true"></div>
                    <div>
                        <dl>
                        <dt className="x-screen-reader">Game Title</dt>
                        <dd><cite>Forza Horizon 2</cite></dd>
                        <div className="c-group">
                            <a href="/components/items/mosaic.html" className="c-call-to-action c-glyph"><span>Buy now</span></a>
                        </div>
                      </dl>
                    </div>
                </article>
            </div>
        )
    }
});

export default Mosaic