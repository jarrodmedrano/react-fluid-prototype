import React from 'react';
import Button from '../../generic/button/Button';
import Text from '../text/Text';
import Picture from '../picture/Picture';
import classNames from 'classnames';
import propsAreValid from '../../../lib/util';
import dataPropTypes, {headingPropTypes} from '../../../../data/dataProps';

class Heading extends React.Component {
    render() {
        if(propsAreValid(this.props.data, this)) {
            let { heading, subheading, paragraph, legalText, button, badge, alignX, pictureBlock, alignY } = this.props.data;
            let { iHero } = this.props;
            let justifyClass = classNames(alignX ? `x-type-${alignX}` : null);

            return (
            <div>
                {/* alignY this is for placement of foreground images, it comes from parent component not from data */}
                {pictureBlock && pictureBlock.picturePlacement !== 'second' && iHero ? <Picture data={pictureBlock} /> : null}
                <div className={`content-animate ${justifyClass}`}>
                    {pictureBlock && pictureBlock.picturePlacement !== 'second' && !iHero ? <Picture data={pictureBlock} /> : null}
                    {badge ? <strong className="c-badge f-large f-highlight"><Text data={badge} /></strong> : null }
                    {heading ? <h1 className="c-heading"><Text data={heading} /></h1> : null }
                    {pictureBlock && pictureBlock.picturePlacement === 'second' && !iHero ? <Picture data={pictureBlock} /> : null}
                    {subheading ? <p className="c-subheading"><Text data={subheading} /></p> : null }
                    {paragraph ? <p className="c-paragraph"><Text data={paragraph} /></p> : null }
                    {button && !button.alignY ? <Button data={button} /> : null }
                    {legalText ? <p className="c-paragraph-4"><Text data={legalText} /></p> : null }
                </div>
                {pictureBlock && pictureBlock.picturePlacement === 'second' && iHero ? <Picture data={pictureBlock} /> : null}
                {button && button.alignY ? <Button data={button} /> : null }
            </div>
            )
        } return null
    }
}

Heading.propTypes = dataPropTypes(headingPropTypes);

export default Heading