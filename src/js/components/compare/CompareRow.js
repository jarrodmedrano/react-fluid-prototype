import React from 'react'
import Heading from '../heading/Heading';
import propsAreValid from '../../util';

class CompareRow extends React.Component {
    render() {
        if(propsAreValid(this.props.data)) {
            return (
                <div className="content-section">
                    <div className="content">
                        <Heading data={this.props.data}/>
                    </div>
                </div>
            )
        } return null
    }
}

export default CompareRow
