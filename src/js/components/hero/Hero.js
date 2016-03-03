import React from 'react';
import classNames from 'classnames';
import HeroPicture from 'src/js/components/hero/HeroPicture';
import 'src/js/components/hero/Hero.scss!';


var Hero = React.createClass({

    isFullScreen() {
        return this.props.fullscreen === 'true' ? 'f-fullscreen': ''
    },


    render() {

        let heroProps = {
            heroSrc: this.props.heroSrc ? <HeroPicture heroSrc={this.props.heroSrc} /> : null,
            heroCta: this.props.ctaButton ? <div className="hero-link-container p-t-xs">
                <a href={this.props.ctaLink} className="c-call-to-action c-glyph"><span>{this.props.ctaText}</span></a>
            </div> : null,
            heroTitle: this.props.heroTitle ? <dd className="c-heading"><cite>{this.props.heroTitle}</cite></dd> : null,
            heroSubTitle: this.props.heroSubTitle ? <div className="c-subheading">{this.props.heroSubTitle}</div> : null,
        };

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
                            {heroProps.heroTitle}
                            <dt className="x-screen-reader">Media Tagline</dt>
                            {heroProps.heroSubTitle}
                        </dl>
                        {heroProps.heroCta}
                    </div>
                </div>
                {heroProps.heroSrc}
            </article>
        )
    }
});

export default Hero