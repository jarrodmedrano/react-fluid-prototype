import React from 'react'
import GenericListItem from './GenericListItem';
import propsAreValid from '../../util';

class GenericList extends React.Component {
    render() {
        if (propsAreValid(this.props.data)) {
            return (
                <ul className="c-list">
                    {this.props.data.compare.models.map(function (result, id) {
                        return (
                            <li key={id}>{result[id]}</li>
                        )
                    })}
                </ul>
            );
        }
        return null;
    }
}

export default GenericList
