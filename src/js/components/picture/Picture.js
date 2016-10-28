import React from 'react';

class Picture extends React.Component {

    render() {

        let { pictures, altText } = this.props.data;

        return (
            <picture className="c-image">
                {pictures ?
                    pictures.map(function (object, id) {
                        return (
                            <source srcSet={object.src} media={object.minwidth} key={id}/>)
                    })
                    : null }
                {pictures ?
                    <img srcSet={pictures[0].src} src={pictures[0].src} alt={altText}/> : null }
            </picture>
        )
    }
}

export default Picture