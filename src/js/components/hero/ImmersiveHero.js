import React from 'react';
import classNames from 'classnames';
import Heading from '../heading/Heading';
import Picture from '../picture/Picture';
import propsAreValid from '../../util';

class ImmersiveHero extends React.Component {
    render() {
        if (propsAreValid(this.props.data)) {
            let {alignY, theme} = this.props.data;
            let heroClass = classNames('m-immersive-hero-item', `f-align-${alignY}`, theme);
            return (
                <div className={heroClass}>
                    <div>
                        <Heading data={this.props.data}/>
                        <Picture data={this.props.data}/>
                    </div>
                </div>
            )
        } return null
    }
}

export default ImmersiveHero