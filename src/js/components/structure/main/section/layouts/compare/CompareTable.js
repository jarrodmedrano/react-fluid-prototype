//! Copyright (C) Microsoft Corporation. All rights reserved.
import React from 'react'
import GenericList from '../../../../../generic/list/GenericList';
import Heading from '../../../../../generic/heading/Heading';
import CompareRow from './CompareRow';
import './scene-config.scss!';
import propsAreValid from '../../../../../../lib/util';

class CompareTable extends React.Component {
    render() {
        if (propsAreValid(this.props.data, this)) {
            return (
                    <div className="config-table">
                        <div className="config-title">
                            <h2 className="c-heading-3">{this.props.data.heading}</h2>
                            <div className="title-border"></div>
                        </div>
                        <div className="auto-width">
                            <div className="configs">
                                {this.props.data.compare.models.map(function (result, id) {
                                    return (
                                       <CompareRow key={id} data={result} />
                                    )
                                })}
                            </div>
                    </div>
                </div>
            )
        }
        return null
    }
}

export default CompareTable
