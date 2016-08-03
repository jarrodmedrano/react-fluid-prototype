import React from 'react'
import 'src/styles/main.scss!';

import _ from 'lodash'

class VerticalPage extends React.Component {

    render() {
        let currentPage = _.find(this.props.data.routes, function(result) {
            return result.title === this.props.route.title
        }, this);

        return (
            <div>

            </div>
        );
    }
}

export default VerticalPage
