import React from 'react';
import classNames from 'classnames';
import 'src/js/components/hero/Hero.scss!';

var Hero = React.createClass({

    isFullScreen() {
        return this.props.fullscreen === 'true' ? 'f-fullscreen': ''
    },

    render() {

        let heroClass = classNames(this.isFullScreen(), 'c-hero f-medium f-x-center theme-dark', this.props.fY != null ? this.props.fY: 'f-y-center');

        return (
            <article className={heroClass}>
                <div>
                    <div className="context-game">
                        <dl>
                            <dt className="x-screen-reader">Media Title</dt>
                            <dd className="c-heading"><cite>Tom Clancy's The Division</cite></dd>
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
                        srcSet={`${this.props.heroSrc}-vp5.jpg`}
                        media="(min-width:1084px)"/>
                    <source
                        srcSet={`${this.props.heroSrc}-vp4.jpg`}
                        media="(min-width:768px)"/>
                    <source
                        srcSet={`${this.props.heroSrc}-vp3.jpg`}
                        media="(min-width:540px)"/>
                    <source
                        srcSet={`${this.props.heroSrc}-vp2.jpg`}
                        media="(min-width:0)"/>

                    <img
                        srcSet={`${this.props.heroSrc}-vp4.jpg`}
                        src={`${this.props.heroSrc}-vp4.jpg`}
                        alt="Martian poster"/>
                </picture>
            </article>
        )
    }
});

export default Hero