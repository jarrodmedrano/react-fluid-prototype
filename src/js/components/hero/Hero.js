import React from 'react';
import classNames from 'classnames';
import HeroPicture from 'src/js/components/hero/HeroPicture';
import 'src/js/components/hero/Hero.scss!';


class Hero extends React.Component {

    render() {
        
        let heroClass = classNames(
            this.props.fullscreen === 'true' ? 'f-fullscreen': '',
            'c-hero theme-dark',
            this.props.fY ? this.props.fY : 'f-y-center',
            this.props.fX ? this.props.fX : 'f-x-center',
            this.props.heroSize ? this.props.heroSize : null
        );

        return (
            <article style={this.props.heroStyle} className={heroClass}>
                <div>
                    <div className="context-game">
                        <dl>
                            <dt className="x-screen-reader">Media Title</dt>
                            {this.props.heroTitle ? <dd className="c-heading"><cite>{this.props.heroTitle}</cite></dd> : null}
                            <dt className="x-screen-reader">Media Tagline</dt>
                            {this.props.heroSubTitle ? <div className="c-subheading">{this.props.heroSubTitle}</div> : null}
                        </dl>
                        {this.props.ctaButton ? <div className="hero-link-container p-t-xs">
                            <a href={this.props.ctaLink} className="c-call-to-action c-glyph"><span>{this.props.ctaText}</span></a>
                        </div> : null}
                    </div>
                </div>
                {this.props.heroSrc ? <HeroPicture heroSrc={this.props.heroSrc} heroFileType={this.props.heroFileType ? this.props.heroFileType : 'jpg'} /> : null}
            </article>
        )
    }
}

export default Hero