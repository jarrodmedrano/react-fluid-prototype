import React from 'react';
import propsAreValid from '../../lib/util';

class Price extends React.Component {
    render() {
        if(propsAreValid(this.props.data)) {
            return (
                <div className="c-label">Starting at <span className="c-heading-5">{this.props.data}</span></div>
            )
        } return null
    }
}
export default Price