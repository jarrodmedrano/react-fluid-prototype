import React from 'react'
//Components
import VerticalPage from './VerticalPage';
import _ from 'lodash/lodash';


class MasterLayout extends React.Component {

    render() {
        return (
            <VerticalPage data={this.props.data} {...this.props} />
        )
    }
}


export default MasterLayout
