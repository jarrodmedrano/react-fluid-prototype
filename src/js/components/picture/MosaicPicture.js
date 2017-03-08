import React from 'react';
import propsAreValid from '../../lib/util';
import dataPropTypes, {MosaicPicturePropTypes} from '../../../data/dataProps';
class MosaicPicture extends React.Component {
    render() {
        if(propsAreValid(this.props.data, this)) {
            let {pictures, altText} = this.props.data;

            let bgStyle = {
                backgroundImage: `url('${pictures[0].src}')`,
                backgroundSize: 'cover',
                overflow: 'hidden',
                width: '100%',
                height: '100%',
                backgroundPosition: 'center center'
            };

            return (
                <canvas className="c-image" style={bgStyle} ref="canvas">
                    <img srcSet={pictures[0].src} src={pictures[0].src} alt={altText ? altText : null}/>
                </canvas>
            );
        } return null
    }
}

MosaicPicture.defaultProps = {
    data: {
        pictures: [{src: '', minwidth: ''}],
        altText: ''
    }
};

MosaicPicture.propTypes = dataPropTypes(MosaicPicturePropTypes);

export default MosaicPicture