import React from 'react'
import GenericList from '../../../../generic/list/GenericList';
import propsAreValid from '../../../../../lib/util';

class CompareRow extends React.Component {
    render() {
        if(propsAreValid(this.props.data, this)) {
            return (
            <div className="config-card text-center">
                <div className="config-top">
                    <GenericList data={this.props.data.specs} />
                </div>
                <div className="config-wrapper">
                    <div className="content-section">
                        <div className="content">
                            <GenericList data={this.props.data.features} />
                        </div>
                    </div>
                </div>
            </div>
            )
        } return null
    }
}

export default CompareRow
