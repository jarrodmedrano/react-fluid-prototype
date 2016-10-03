import React from 'react';
import classNames from 'classnames';
import HeroPicture from './HeroPicture';
import './Hero.scss';
import Button from '../button/Button';

class Hero extends React.Component {
    render() {
        let { heading, subheading, paragraph, pictures, button, picture, altText } = this.props.data;

        return (
            <section className="m-hero-item f-medium f-x-left f-y-bottom context-accessory theme-dark">
                <picture className="c-image">
                    {
                        pictures.map(function(object, id)
                        {
                            return (
                                <source srcSet={object.src} media={object.minwidth} key={id} />)
                        })
                    }
                    {picture ? <img srcSet={picture} src={picture} alt={altText} /> : null}
                </picture>
                <div>
                    <div className="content-animate">
                        <h1 className="c-heading">{heading}</h1>
                        <p className="c-subheading">{subheading}</p>
                        <p className="c-paragraph-1">{paragraph}</p>
                        <Button data={button}/>
                    </div>
                </div>
            </section>
        )
    }
}

export default Hero