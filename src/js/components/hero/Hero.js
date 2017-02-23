import React from 'react';
import classNames from 'classnames';
import Heading from '../heading/Heading';
import './Hero.scss!';
import Picture from '../picture/Picture';
import propsAreValid from '../../lib/util';
import dataPropTypes, {heroPropTypes} from '../../../data/dataProps';

class Hero extends React.Component {

    componentWillReceiveProps(nextProps) {
        this._handleVideo(nextProps.active);
    }

    componentWillUnmount() {
        if(this.refs.vidRef) {
            this.refs.vidRef.currentTime = 0;
        }
    }

    _handleVideo(play) {
        if(this.refs.vidRef) {
            if(play === true && this.refs.vidRef.paused) {
                this.refs.vidRef.play();
            } else if(play === false && !this.refs.vidRef.paused) {
                this.refs.vidRef.pause();
            }
        }
    }

    render() {
        if (propsAreValid(this.props.data)) {
            let {alignX, alignY, theme, layout} = this.props.data;
            let heroClass = classNames(
                alignX ? `f-x-${alignX}` : null,
                alignX ? `f-align-${alignX}` : null,
                alignY ? `f-y-${alignY}` : null,
                alignY ? `f-align-${alignY}` : null,
                theme ? theme : null,
                layout ? `m-${layout}-item` : null);
            if (layout === 'immersive-hero') {
                return (
                    <div className={heroClass}>
                        <div>
                            <Heading data={this.props.data}/>
                            <Picture data={this.props.data}/>
                        </div>
                    </div>
                )
            }
            else if (layout === 'fullscreen') {
                let heroClassFScreen = classNames(heroClass, 'm-image-intro f-transparent');
                if (this.props.data.video) {
                    return (
                        <div>
                            <video ref="vidRef" className="video-fullscreen fixed" loop>
                                <source src={this.props.data.video} type="video/mp4"/>
                            </video>
                        </div>
                    )
                }
                else {
                    return (
                        <div className={heroClassFScreen}>
                            <Heading data={this.props.data}/>
                            <Picture data={this.props.data}/>
                        </div>
                    )
                }
            }
            else if (layout === 'card') {
                let heroClassCard = classNames(heroClass, 'm-highlight-feature');
                return (
                    <div data-grid="col-12" className={heroClassCard}>
                        <Picture data={this.props.data}/>
                        <div>
                            <Heading data={this.props.data}/>
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
        }
        return null
    }
}

Hero.propTypes = dataPropTypes(heroPropTypes);

export default Hero