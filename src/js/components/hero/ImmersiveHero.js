import React from 'react';
import classNames from 'classnames';
import Heading from '../heading/Heading';
import Picture from '../picture/Picture';

class ImmersiveHero extends React.Component {

    render() {

        let { alignY, theme } = this.props.data;

        let heroClass = classNames('m-immersive-hero-item', `f-align-${alignY}`, `theme-${theme}`);

        return (
            <div className={heroClass}>
                <div>
                    <Heading data={this.props.data} />
                    <Picture data={this.props.data} />
                </div>
            </div>
        )
    }
}

export default ImmersiveHero