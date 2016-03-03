import React from 'react';
import classNames from 'classnames';
import HeroPicture from 'src/js/components/hero/HeroPicture';
import 'src/js/components/hero/Hero.scss!';


var Hero = React.createClass({

    isFullScreen() {
        return this.props.fullscreen === 'true' ? 'f-fullscreen': ''
    },


    render() {
        let heroClass = classNames(
            this.isFullScreen(),
            'c-hero f-x-center theme-dark',
            this.props.fY ? this.props.fY : 'f-y-center',
            this.props.heroSize ? this.props.heroSize : 'f-medium'
        );

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
                        {this.props.ctaButton ? <div className="hero-link-container p-t-xs">
                            <a href={this.props.ctaLink} className="c-call-to-action c-glyph"><span>{this.props.ctaText}</span></a>
                        </div> : null}

                    </div>
                </div>
                {this.props.heroSrc ? <HeroPicture heroSrc={this.props.heroSrc} /> : null}
            </article>
        )
    }
});

export default Hero