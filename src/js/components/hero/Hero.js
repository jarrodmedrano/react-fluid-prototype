import React from 'react';
import classNames from 'classnames';
import Heading from '../heading/Heading';
import './Hero.scss!';
import Picture from '../picture/Picture';
import propsAreValid from '../../util';
import dataPropTypes, { heroPropTypes } from '../../../data/dataProps';

class Hero extends React.Component {
    render() {
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
            }
            else if(layout === 'fullscreen') {
                let heroClassFScreen = classNames(heroClass, 'm-image-intro f-transparent');
                if(this.props.data.video) {
                    return (
                        <div>
                            <video className="video-fullscreen fixed" loop>
                                <source src={this.props.data.video} type="video/mp4" />
                            </video>
                        </div>
                    )
                } else {
                    return (
                        <div className={heroClassFScreen}>
                            <Heading data={this.props.data}/>
                            <Picture data={this.props.data}/>
                        </div>
                    )
                }
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

Hero.propTypes = dataPropTypes(heroPropTypes);

export default Hero