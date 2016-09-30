import React from 'react';
import classNames from 'classnames';
import Button from '../button/Button';

class ImmersiveHero extends React.Component {

    render() {
        let { title, heading, subheading, paragraph, picture, pictures, altText, ariaLabel, button } = this.props.data;

        {/* TODO: add positioning style based on data value */ }
        return (
            <section className="m-immersive-hero-item theme-light f-align-top">
                <div>
                    <div>
                        <h1 className="c-heading">{heading}</h1>
                        <p className="c-subheading">{subheading}</p>
                        <Button data={button}/>
                    </div>
                    <picture className="c-image">
                    {/*
                        pictures.map(function(object)
                        {
                            return (
                                <source srcSet={object.src} media={obejct.minwidth} />)
                        })
                    */}
                        {picture ? <img srcSet={picture} src={picture} alt={altText} aria-label={ariaLabel} /> : null}
                    </picture>
                </div>
            </section>
        )
    }
}

export default ImmersiveHero