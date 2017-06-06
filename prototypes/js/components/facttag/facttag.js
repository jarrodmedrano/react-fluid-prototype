import React from 'react';
import classNames from 'classnames';
import Heading from '../../../../src/js/components/generic/heading/Heading';
import Picture from '../../../../src/js/components/generic/picture/Picture';
import Video from '../../../../src/js/components/generic/video/Video';
import Price from '../../../../src/js/components/generic/price/Price';
import Text from '../../../../src/js/components/generic/text/Text';
import Button from '../../../../src/js/components/generic/button/Button';
import GenericList from '../../../../src/js/components/generic/list/GenericList';
import propsAreValid from '../../../../src/js/lib/util';
import dataPropTypes, {heroPropTypes} from '../../../../src/data/dataProps';

class FactTag extends React.Component  {
        render() {

        const heroClassCard = classNames(heroClass, 'm-highlight-feature fact-tag');
        const {heading, subheading, paragraph, button, badge} = this.props.data.headingBlock;
        const {ScreenSize, ProcessorDescription, Memory, StorageDescription} = this.props.deviceInfo;

        const specs = [ScreenSize, ProcessorDescription, Memory, StorageDescription];

        return (
            <div data-grid="col-12" className={heroClassCard}>
                {renderMedia(this.props)}
                <div>
                    <div>
                        <div className="content-animate">
                            {badge ? <strong className="c-badge f-large f-highlight"><Text data={badge} /></strong> : null }
                            {heading ? <h1 className="c-heading"><Text data={heading} /></h1> : null }
                            {subheading ? <p className="c-subheading"><Text data={subheading} /></p> : null }
                            {paragraph ? <p className="c-paragraph"><Text data={paragraph} /></p> : null }
                            <GenericList data={specs} />
                            <Price data={this.props.deviceInfo} />
                            {button ? <Button data={button} /> : null }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default FactTag