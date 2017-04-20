import React from 'react'
import classNames from 'classnames';
import GenericList from '../../../../generic/list/GenericList';
import propsAreValid from '../../../../../lib/util';

class CompareRow extends React.Component {
    render() {
        if (propsAreValid(this.props.data, this)) {

            let {headingBlock, specs, features, selected, selectedHeader} = this.props.data;

            let templateClass = classNames(`${selected === true ? `selected` : null}`, 'config-card text-center');

            return (
                <div className={templateClass}>
                    <div className="selected-header">{selectedHeader}</div>
                    <div className="details">
                        <div className="config-specs">
                            <ul className="c-list">
                                <li className="glyph-cpu mdl-glyph c-heading-5">{specs[0]}</li>
                                <li className="glyph-drive mdl-glyph">{specs[1]}</li>
                                <li className="glyph-ram mdl-glyph">{specs[2]}</li>
                            </ul>
                        </div>
                        <div className="content-section">
                            <div className="content">
                                <p className="c-paragraph-4">{headingBlock.paragraph}</p>
                            </div>
                        </div>
                        <div className="config-wrapper">
                            <div className="content-section">
                                <div className="content">
                                    <GenericList data={features}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        return null
    }
}

export default CompareRow
