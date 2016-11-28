import React from 'react'
import propsAreValid from '../../util';

class GenericListItem extends React.Component {
    render() {
        if (propsAreValid(this.props.data)) {
            return (
                <li>{this.props.data}</li>
            );
        } return null
    }
}

export default GenericListItem
