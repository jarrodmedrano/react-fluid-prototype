import React from 'react';
import Starrating from '../starrating/Starrating';
import Button from '../button/Button';
import ButtonLink from '../link/ButtonLink';
import _ from 'lodash';
import './sticky-banner.scss!';
import propsAreValid from '../../lib/util';
import dataPropTypes, {devicePropTypes} from '../../../data/dataProps';

class StickyButton extends React.Component {
    render() {
        return (
            <div className="cta">
                <div>
                    <Button data={this.props.data.brand} />
                </div>
            </div>
        )
    }
}

export default StickyButton;