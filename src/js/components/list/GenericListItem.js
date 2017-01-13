import React from 'react'
import propsAreValid from '../../lib/util';
import {listItemPropTypes} from '../../../data/dataProps';

class GenericListItem extends React.Component {
    render() {
        if (propsAreValid(this.props.data)) {
            return (
                <li>
                    {this.props.data}
                </li>
            )
        } return null
    }
}

GenericListItem.propTypes = listItemPropTypes;

export default GenericListItem
