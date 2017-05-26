import React from 'react';
import propsAreValid from '../../../lib/util';
import dataPropTypes, {picturePropTypes} from '../../../../data/dataProps';

class Picture extends React.Component {
    render() {
        if(propsAreValid(this.props.data, this)) {
            let {pictures, altText, ariaLabel} = this.props.data;
            return (
                <picture className="c-image">
                    {pictures.map(function (object, id) {
                        return (
                            <source srcSet={object.src} media={`(min-width:${object.minWidth ? object.minWidth : '0'}px)`} key={id} />
                        )
                    })}
                    <img srcSet={pictures[0].src} src={pictures[0].src} alt={altText ? altText : null} aria-label={ ariaLabel ? ariaLabel : null} draggable="false" />
                </picture>
            )
        } return null
    }
}

Picture.defaultProps = {
    data: {
        pictures: [{src: '', minwidth: ''}],
        altText: '',
        ariaLabel: ''
    }
};

Picture.propTypes = dataPropTypes(picturePropTypes);

export default Picture