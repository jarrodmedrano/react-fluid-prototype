import React from 'react'
import propsAreValid from '../../lib/util';
import {listItemPropTypes} from '../../../data/dataProps';
import Text from '../text/Text';

class GenericListItem extends React.Component {
    render() {
        if (propsAreValid(this.props.data, this)) {
            return (
                <li>
                    <Text data={this.props.data} />
                </li>
            )
        } return null
    }
}

GenericListItem.propTypes = listItemPropTypes;

export default GenericListItem
