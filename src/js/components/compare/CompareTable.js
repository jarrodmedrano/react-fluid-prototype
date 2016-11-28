//! Copyright (C) Microsoft Corporation. All rights reserved.
import React from 'react'
import GenericList from '../list/GenericList';
import Heading from '../heading/Heading';
import CompareRow from './CompareRow';
import './scene-config.scss!';
import propsAreValid from '../../util';

class CompareTable extends React.Component {
    render() {
        if (propsAreValid(this.props.data)) {
            return (
                <div>
                    <div className="config-title">
                        <Heading data={this.props.data}/>
                    </div>
                    <div className="configs">
                        {this.props.data.compare.models.map(function (result, id) {
                            return (
                               <CompareRow key={id} data={this.props.data}/>
                            )
                        }, this)}
                    </div>
                </div>
            )
        }
        return null
    }
}

export default CompareTable
