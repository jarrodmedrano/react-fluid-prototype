import React from 'react';
import classNames from 'classnames';

var Hero = React.createClass({


    render() {
        return (
            <article className="c-hero f-medium f-x-center f-y-center theme-dark">
                <div>
                    <div className="context-game">
                        <dl>
                            <dt className="x-screen-reader">Media Title</dt>
                            <dd className="c-heading">Tom Clancy's The Division</dd>
                            <dt className="x-screen-reader">Media Tagline</dt>
                            <div className="c-subheading">Take back New York in Tom Clancy's The Division open
                                beta. Early access available only on Xbox One, February 18th.</div>
                        </dl>
                        <div className="hero-link-container p-t-xs">
                            <a href="#" className="c-call-to-action c-glyph"><span>Pre-order today</span></a>
                        </div>
                    </div>
                </div>
                <picture>
                    <source
                        srcSet="http://c2278.paas2.tx.modxcloud.com/images/components/division-hero-background-vp5.jpg"
                        media="(min-width:1084px)"/>
                    <source
                        srcSet="http://c2278.paas2.tx.modxcloud.com/images/components/division-hero-background-vp4.jpg"
                        media="(min-width:768px)"/>
                    <source
                        srcSet="http://c2278.paas2.tx.modxcloud.com/images/components/division-hero-background-vp3.jpg"
                        media="(min-width:540px)"/>
                    <source
                        srcSet="http://c2278.paas2.tx.modxcloud.com/images/components/division-hero-background-vp2.jpg"
                        media="(min-width:0)"/>

                    <img
                        srcSet="http://c2278.paas2.tx.modxcloud.com/images/components/division-hero-background-vp4.jpg"
                        src="http://c2278.paas2.tx.modxcloud.com/images/components/division-hero-background-vp4.jpg"
                        alt="Martian poster"/>
                </picture>
            </article>
        )
    }
});

export default Hero