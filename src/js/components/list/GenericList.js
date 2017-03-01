import React from 'react'
import _ from 'lodash'
import GenericListItem from './GenericListItem';
import propsAreValid, {entries} from '../../lib/util';
import {listPropTypes} from '../../../data/dataProps';

class GenericList extends React.Component {
    render() {
        if (propsAreValid(this.props.data, this)) {
            return (
                <ul className="c-list">
                    {this.props.data.map(function(result, id) {
                        return (
                            <GenericListItem key={id} data={result} />
                        )
                    }, this)}
                </ul>
            )
        }
        return null;
    }
}

GenericList.propTypes = listPropTypes;

export default GenericList
