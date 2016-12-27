import React from 'react'
import _ from 'lodash'
import GenericListItem from './GenericListItem';
import propsAreValid, {entries} from '../../util';

class GenericList extends React.Component {
    render() {
        if (propsAreValid(this.props.data)) {
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

export default GenericList
