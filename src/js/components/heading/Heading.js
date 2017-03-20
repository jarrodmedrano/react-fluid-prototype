import React from 'react';
import Button from '../button/Button';
import Picture from '../picture/Picture';
import propsAreValid from '../../lib/util';
import dataPropTypes, {headingPropTypes} from '../../../data/dataProps';

class Heading extends React.Component {
    render() {
        if(propsAreValid(this.props.data, this)) {
            let { heading, subheading, paragraph, button, badge } = this.props.data,
                picture = this.props.picture,
                alignY = this.props.alignY;

            return (
            <div>
                {/*{picture && alignY === 'bottom' ? <Picture data={picture} /> : null }*/}
                <div className="content-animate">
                    {badge ? <strong className="c-badge f-large f-highlight">{badge}</strong> : null }
                    {heading ? <h1 className="c-heading">{heading}</h1> : null }
                    {subheading ? <p className="c-subheading">{subheading}</p> : null }
                    {paragraph ? <p className="c-paragraph">{paragraph}</p> : null }
                    {button ? <Button data={button} /> : null }
                </div>
                {/*{picture && alignY === 'top' ? <Picture data={picture} /> : null }*/}
            </div>
            )
        } return null
    }
}

Heading.propTypes = dataPropTypes(headingPropTypes);

export default Heading