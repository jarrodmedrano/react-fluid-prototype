import React from 'react'
//Components
import VerticalPage from './VerticalPage';

class MasterLayout extends React.Component {

    render() {
        return (
            <VerticalPage data={this.props.data} {...this.props} />
        )
    }
}

MasterLayout.propTypes = {
    data: React.PropTypes.object.isRequired
};

export default MasterLayout
