import React from 'react';

var HeroPicture = React.createClass({

    render() {

        return (
            <picture>
                <source
                    srcSet={`img/${this.props.heroSrc}-vp5.${this.props.heroFileType}`}
                    media="(min-width:1084px)"/>
                <source
                    srcSet={`img/${this.props.heroSrc}-vp4.${this.props.heroFileType}`}
                    media="(min-width:768px)"/>
                <source
                    srcSet={`img/${this.props.heroSrc}-vp3.${this.props.heroFileType}`}
                    media="(min-width:540px)"/>
                <source
                    srcSet={`img/${this.props.heroSrc}-vp2.${this.props.heroFileType}`}
                    media="(min-width:0)"/>

                <img
                    srcSet={`img/${this.props.heroSrc}-vp4.${this.props.heroFileType}`}
                    src={`img/${this.props.heroSrc}-vp4.${this.props.heroFileType}`}
                    alt="Martian poster"/>
            </picture>
        )
    }

});

export default HeroPicture