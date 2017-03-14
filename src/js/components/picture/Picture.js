import React from 'react';
import propsAreValid from '../../lib/util';
import dataPropTypes, {picturePropTypes} from '../../../data/dataProps';

class Picture extends React.Component {
    render() {
        if(propsAreValid(this.props.data, this)) {
            let {picture, altText, ariaLabel} = this.props.data;

            return (
                <picture className="c-image">
                    {picture.map(function (object, id) {
                        return (
                            <source srcSet={object.src} media={`(min-width:${object.minWidth}px)`} key={id}/>
                        )
                    })}
                    <img srcSet={picture[0].src} src={picture[0].src} alt={altText ? altText : null} aria-label={ ariaLabel ? ariaLabel : null}/>
                </picture>
            )
        } return null
    }
}

Picture.defaultProps = {
    data: {
        picture: [{src: '', minwidth: ''}],
        altText: '',
        ariaLabel: ''
    }
};

Picture.propTypes = dataPropTypes(picturePropTypes);

export default Picture