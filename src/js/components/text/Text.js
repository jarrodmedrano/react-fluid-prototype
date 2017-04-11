import React from 'react';
import propsAreValid, {cleanHtml} from '../../lib/util';

class Text extends React.Component {
    render() {
        if (propsAreValid(this.props.data, this)) {
            return (
                <span {...this.props} dangerouslySetInnerHTML={{__html: cleanHtml(this.props.data)}} />
            )
        } return null
    }
}

export default Text;