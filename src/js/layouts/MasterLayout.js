import React from 'react'
import propsAreValid from '../lib/util';
//Components
import VerticalPage from './VerticalPage';

class MasterLayout extends React.Component {
    render() {
        if (propsAreValid(this.props.data, this)) {
            return (
                <VerticalPage data={this.props.data} {...this.props} />
            )
        }
    }
}

MasterLayout.propTypes = {
    data: React.PropTypes.object.isRequired
};

export default MasterLayout
