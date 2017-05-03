import React from 'react';
import Button from '../../generic/button/Button';
import Text from '../text/Text';
import propsAreValid from '../../../lib/util';
import dataPropTypes, {headingPropTypes} from '../../../../data/dataProps';

class Heading extends React.Component {
    render() {
        if(propsAreValid(this.props.data, this)) {
            let { heading, subheading, paragraph, legalText, button, badge } = this.props.data,
                picture = this.props.picture,
                alignY = this.props.alignY;

            return (
            <div>
                {/*{picture && alignY === 'bottom' ? <Picture data={picture} /> : null }*/}
                <div className="content-animate">
                    {badge ? <strong className="c-badge f-large f-highlight"><Text data={badge} /></strong> : null }
                    {heading ? <h1 className="c-heading"><Text data={heading} /></h1> : null }
                    {subheading ? <p className="c-subheading"><Text data={subheading} /></p> : null }
                    {paragraph ? <p className="c-paragraph"><Text data={paragraph} /></p> : null }
                    {button ? <Button data={button} /> : null }
                    {legalText ? <p className="c-paragraph-4"><Text data={legalText} /></p> : null }
                </div>
                {/*{picture && alignY === 'top' ? <Picture data={picture} /> : null }*/}
            </div>
            )
        } return null
    }
}

Heading.propTypes = dataPropTypes(headingPropTypes);

export default Heading