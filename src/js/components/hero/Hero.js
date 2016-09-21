import React from 'react';
import classNames from 'classnames';
import HeroPicture from './HeroPicture';
import './Hero.scss';


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
            <section className="m-hero-item f-medium f-x-left f-y-top context-accessory theme-dark" itemScope itemType="http://schema.org/Product">
                <picture>
                    <source srcSet="http://placehold.it/1600x600/2F2F2F/171717" media="(min-width: 1779px)" />
                        <source srcSet="http://placehold.it/1600x600/2F2F2F/171717" media="(min-width: 1400px)" />
                            <source srcSet="http://placehold.it/1259x472/2F2F2F/171717" media="(min-width: 1084px)" />
                                <source srcSet="http://placehold.it/1083x609/2F2F2F/171717" media="(min-width:768px)" />
                                    <source srcSet="http://placehold.it/767x431/2F2F2F/171717" media="(min-width:540px)" />
                                        <source srcSet="http://placehold.it/539x303/2F2F2F/171717" media="(min-width:0)" />
                                            <img srcSet="http://placehold.it/1259x472/2F2F2F/171717" src="http://placehold.it/1259x472/2F2F2F/171717" alt="Placeholder with grey background and dimension watermark without any imagery" />
                </picture>
                <div>
                    <div>
                        <h1 className="c-heading">Heading</h1>
                        <p className="c-subheading">Subheading</p>
                        <div className="c-price" itemProp="offers" itemScope itemType="http://schema.org/Offer">
                            <meta itemProp="priceCurrency" content="USD" />
                                <span>$</span>
                                <span itemProp="price">10</span>
                                <link itemProp="availability" href="http://schema.org/InStock" />
                        </div>
                        <div>
                            <a href="#" className="c-call-to-action c-glyph">
                                <span>CALL TO ACTION</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default Hero