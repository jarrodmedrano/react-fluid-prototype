import React from 'react';

class Picture extends React.Component {

    render() {

        let { pictures, picture, altText } = this.props.data;

        return (
            <picture className="c-image">
                {pictures ?
                    pictures.map(function (object, id) {
                        return (
                            <source srcSet={object.src} media={object.minwidth} key={id}/>)
                    })
                    : null }
                {picture ?
                    <img srcSet={picture} src={picture} alt={altText}/> : null }
            </picture>
        )
    }
}

export default Picture