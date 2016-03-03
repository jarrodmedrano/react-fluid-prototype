import React from 'react';

var HeroPicture = React.createClass({

    render() {

        return (
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
        )
    }

});

export default HeroPicture