import React from 'react'
import propsAreValid from '../../../lib/util';

class Video extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            mute: true
        }
    }

    componentWillReceiveProps(nextProps) {
        this._handleVideo(nextProps.active);
    }

    shouldComponentUpdate(nextProps) {
        //nextProps.updated === true ? this._resetVideo() : null;
        nextProps.myId === 0 ? this.setState({mute: true}) : this.setState({mute: false});
        return true;
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
            let {src} = this.props.data;

            return (
                //TODO: fix aria labels
                <video className="f-video-player" preload="metadata" loop
                       aria-labelledby="" aria-describedby=""
                       ref="vidRef" muted={this.state.mute} >
                    <source src={src ? src : null} type="video/mp4"/>
                </video>
            )
        }
        return null;
    }
}
//TODO: fix prop types
Video.propTypes = {};

export default Video
