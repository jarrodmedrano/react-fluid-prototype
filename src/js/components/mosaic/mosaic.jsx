import React from 'react'

var Mosaic = React.createClass({

    render() {
        return(
            <div className="c-mosaic">
                <div className="theme-dark" data-f-mosaic="f-vp1-whole f-vp4-half f-height-large">
                    <article className="c-placement context-accessory f-width-large f-height-large">
                        <picture>
                            <img srcSet="http://www.getmwf.com/images/components/placement-background-tombraider.jpg" src="http://www.getmwf.com/images/components/placement-background-tombraider.jpg" alt="Rise of the Tomb Raider" />
                        </picture>
                        <div>
                            <dt className="x-screen-reader">Game Title</dt>
                            <dd><cite>Rise of the Tomb Raider</cite></dd>
                            <dt className="x-screen-reader">Game tagline</dt>
                            <dd>Discover the legend within</dd>
                            <div className="c-group">
                                <a href="/components/items/mosaic.html" className="c-call-to-action c-glyph"><span>Learn more</span></a>
                            </div>
                        </div>
                    </article>
                </div>
                <div data-f-mosaic="f-vp1-whole f-vp4-half">
                    <div className="theme-dark" data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                        <article className="c-placement context-game f-width-small f-height-large">
                            <picture>
                                <img srcSet="http://www.getmwf.com/images/components/placement-background-tombraider.jpg" src="http://www.getmwf.com/images/components/placement-background-tombraider.jpg" alt="Forza" />
                            </picture>

                            <div className="c-image-overlay" aria-hidden="true"></div>
                            <div>
                                <dt className="x-screen-reader">Game Title</dt>
                                <dd><cite>Forza Horizon 2</cite></dd>
                                <div className="c-group">
                                    <a href="/components/items/mosaic.html" className="c-call-to-action c-glyph"><span>Buy now</span></a>
                                </div>
                            </div>
                        </article>
                    </div>
                    <div className="theme-dark" data-f-mosaic="f-vp1-whole f-vp2-half f-height-medium">
                        <article className="c-placement context-accessory f-width-small f-height-large">

                            <picture>
                                <img srcSet="http://www.getmwf.com/images/components/placement-background-tombraider.jpg" src="http://www.getmwf.com/images/components/placement-background-tombraider.jpg" alt="Xbox One Elite bundle" />
                            </picture>

                            <div>
                                <dt className="x-screen-reader">Game Title</dt>
                                <dd><cite>Xbox One Elite bundle</cite></dd>
                                <dt className="x-screen-reader">Game tagline</dt>
                                <dd>1TB SSHD and Elite controller</dd>
                                <div className="c-group">
                                    <a href="/components/items/mosaic.html" className="c-call-to-action c-glyph"><span>Buy now</span></a>
                                </div>
                            </div>
                        </article>
                    </div>
                    <div className="theme-dark" data-f-mosaic="f-vp1-whole f-height-medium">
                        <article className="c-placement context-accessory f-width-large f-height-large">

                            <picture>
                                <img srcSet="http://www.getmwf.com/images/components/placement-background-tombraider.jpg" src="http://www.getmwf.com/images/components/placement-background-tombraider.jpg" alt="Halo 5" />
                            </picture>

                            <div className="c-image-overlay" aria-hidden="true"></div>
                            <div>
                                <dl>
                                    <dt className="x-screen-reader">Game Title</dt>
                                    <dd><cite>Halo 5</cite></dd>
                                    <dt className="x-screen-reader">Game tagline</dt>
                                    <dd>The next generation of Halo is here.</dd>
                                </dl>

                                <div className="c-group">
                                    <a href="/components/items/mosaic.html" className="c-call-to-action c-glyph"><span>Learn more</span></a>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            </div>
        )
    }
});

export default Mosaic