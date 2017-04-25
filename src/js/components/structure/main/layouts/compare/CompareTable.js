//! Copyright (C) Microsoft Corporation. All rights reserved.
import React from 'react'
import CompareRow from './CompareRow';
import propsAreValid from '../../../../../lib/util';

class CompareTable extends React.Component {
    render() {
        if (propsAreValid(this.props.data, this)) {

            let {headingBlock, compare} = this.props.data;

            return (
                <div>
                    <div className="config-table">
                        <div className="config-title">
                            <h2 className="c-heading-3">{headingBlock.heading}</h2>
                            <hr className="c-subdivider"/>
                        </div>
                        <div className="auto-width">
                            <div className="configs">
                                {compare.models.map(function (result, id) {
                                    return (
                                        <CompareRow key={id} data={result}/>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        return null
    }
}

export default CompareTable
