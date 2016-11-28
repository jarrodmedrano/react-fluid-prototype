import React from 'react'
import GenericListItem from './GenericListItem';

class GenericList extends React.Component {
    render() {
        return (
            <ul className="c-list">
                <GenericListItem />
            </ul>
        );
    }
}

export default GenericList
