import React from 'react'
import Vertical from './Vertical';

class Group extends React.Component {


    render() {
        let vertical = this.props.vertical;
        return(
            <div>
                {vertical.map(function(result, id) {
                    return (
                        <Vertical key={id} vertical={result} />
                    )
                })}
            </div>
        )
    }
}

export default Group