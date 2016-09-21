import React from 'react';
import classNames from 'classnames';


class ImmersiveHero extends React.Component {

    render() {
        return (
            <section className="m-immersive-hero-item theme-light f-align-top">
                {/*<picture className="c-image">*/}
                    {/*<source srcSet="http://placehold.it/2400x1600" media="(min-width: 1779px)" />*/}
                        {/*<source srcSet="http://placehold.it/1778x1185" media="(min-width:1400px)" />*/}
                            {/*<source srcSet="http://placehold.it/1399x931" media="(min-width:1084px)" />*/}
                                {/*<source srcSet="http://placehold.it/1083x1805" media="(min-width:768px)" />*/}
                                    {/*<source srcSet="http://placehold.it/768x1280" media="(min-width:540px)" />*/}
                                        {/*<source srcSet="http://placehold.it/539x898" media="(min-width:0)" />*/}
                                            {/*<img srcSet="http://placehold.it/1399x931" src="http://placehold.it/1399x931" alt="Placeholder with grey background and dimension watermark without any imagery" aria-label="Placeholder with grey background and dimension watermark" />*/}
                {/*</picture>*/}
                    <div>
                    <div>
                        <h1 className="c-heading">Immersive hero heading spans up to two lines</h1>
                        <p className="c-subheading">Subheading can span to two lines</p>
                        <a href="#" className="c-call-to-action c-glyph" aria-label="Important: Call to action">
                            <span>CALL TO ACTION</span>
                        </a>
                    </div>
                    <picture className="c-image">
                        <source srcSet="http://placehold.it/2048x1152" media="(min-width: 1779px)" />
                            <source srcSet="http://placehold.it/1778x1000" media="(min-width:1400px)" />
                                <source srcSet="http://placehold.it/1399x787" media="(min-width:1084px)" />
                                    <source srcSet="http://placehold.it/1083x812" media="(min-width:768px)" />
                                        <source srcSet="http://placehold.it/767x575" media="(min-width:540px)" />
                                            <source srcSet="http://placehold.it/539x404" media="(min-width:0)" />
                                                <img srcSet="http://placehold.it/1399x787" src="http://placehold.it/1399x787" alt="Placeholder image" aria-label="Placeholder with grey background and dimension watermark" />
                    </picture>
                </div>
            </section>
        )
    }
}

export default ImmersiveHero