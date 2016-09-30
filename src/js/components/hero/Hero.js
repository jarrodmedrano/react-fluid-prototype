import React from 'react';
import classNames from 'classnames';
import HeroPicture from './HeroPicture';
import './Hero.scss';


class Hero extends React.Component {

    render() {


        return (
            <section className="m-hero-item f-medium f-x-left f-y-bottom context-accessory theme-dark" itemScope itemType="http://schema.org/Product">
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
                    <div className="content-animate">
                        <h1 className="c-heading">Heading</h1>
                        <p className="c-subheading">Subheading</p>
                        <p class="c-paragraph-1">Paragraph lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vitae convallis eros, nec iaculis nisi. Duis imperdiet elementum diam, eu tempor quam tempus sit amet. Suspendisse eu tortor quis odio faucibus tempus sed</p>
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