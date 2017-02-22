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
            <Button data={this.props.data.brand} />
        )
    }
}

export default StickyButton;