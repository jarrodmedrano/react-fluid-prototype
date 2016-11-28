import React from 'react'
import Heading from '../heading/Heading';
import GenericList from '../list/GenericList';
import propsAreValid from '../../util';

class CompareRow extends React.Component {
    render() {
        if(propsAreValid(this.props.data)) {
            return (
            <div className="config-card text-center">
                <div className="config-top">
                    <GenericList data={this.props.data}/>
                </div>
                <div className="config-wrapper">
                    <Heading data={this.props.data}/>
                </div>
            </div>
            )
        } return null
    }
}

export default CompareRow
