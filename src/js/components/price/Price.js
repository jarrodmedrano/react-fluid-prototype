import React from 'react';
import propsAreValid from '../../lib/util';
//This is the price component displayed in the header
class Price extends React.Component {
    render() {
        if(propsAreValid(this.props.data, this)) {
            return (
                <div className="c-label">Starting at <span className="c-heading-5">{this.props.data}</span></div>
            )
        } return null
    }
}
export default Price