import React from 'react';
import Button from '../button/Button';
import propsAreValid from '../../lib/util';
import dataPropTypes, {headingPropTypes} from '../../../data/dataProps';

class Heading extends React.Component {
    render() {
        if(propsAreValid(this.props.data)) {
        let { heading, subheading, paragraph } = this.props.data;
        return (
            <div>
                <div className="content-animate">
                    {heading ? <h1 className="c-heading">{heading}</h1> : null }
                    {subheading ? <p className="c-subheading">{subheading}</p> : null }
                    {paragraph ? <p className="c-paragraph-1">{paragraph}</p> : null }
                    {this.props.data.button ? <Button data={this.props.data}  /> : null }
                </div>
            </div>
            )
        } return null
    }
}

Heading.propTypes = dataPropTypes(headingPropTypes);

export default Heading