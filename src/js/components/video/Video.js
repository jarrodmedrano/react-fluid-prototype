import React from 'react'
import propsAreValid from '../../lib/util';

class Video extends React.Component {

    componentWillReceiveProps(nextProps) {
        this._handleVideo(nextProps.active);
        nextProps.updated === true ? this._resetVideo() : null;
    }

    componentDidMount() {
        this._resetVideo();
    }

    componentWillUnmount() {
        this._resetVideo();
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

    _resetVideo() {
        if(this.refs.vidRef) {
            this.refs.vidRef.currentTime = 0;
        }
    }

    render() {
        if (propsAreValid(this.props.data, this)) {
            let {media, video} = this.props.data,
                className = this.props;

            return (
                //TODO: fix aria labels
                <video className={className ? className : 'f-video-player'} preload="metadata" loop
                       aria-labelledby="" aria-describedby=""
                       ref="vidRef">
                    <source src={media ? media.src : video ? video : null} type="video/mp4"/>
                </video>
            )
        }
        return null;
    }
}
//TODO: fix prop types
Video.propTypes = {};

export default Video
