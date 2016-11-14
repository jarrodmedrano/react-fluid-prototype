import React from 'react';
import classNames from 'classnames';
import Heading from '../heading/Heading';
import './Hero.scss!';
import Picture from '../picture/Picture';
import propsAreValid from '../../util';

class Hero extends React.Component {
    render() {
        console.log(this.props);
        if(propsAreValid(this.props.data)) {
            let {alignX, alignY, theme, layout} = this.props.data;
            let heroClass = classNames(`f-x-${alignX}`, `f-y-${alignY}`, `f-align-${alignY}`, theme, `m-${layout}-item`);
            if(layout === 'immersive-hero') {
                return (
                    <div className={heroClass}>
                        <div>
                            <Heading data={this.props.data}/>
                            <Picture data={this.props.data}/>
                        </div>
                    </div>
                )
            } else {
                return (
                    <div className={heroClass}>
                            <Picture data={this.props.data}/>
                            <Heading data={this.props.data}/>
                    </div>
                )
            }
        } return null
    }
}

export default Hero