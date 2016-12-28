import React from 'react'
import './fullscreen.scss!'

class FullScreen extends React.Component {

    render() {

        let { video } = this.props.data;

        let bgStyle = {
            width: '100vw',
            height: '100vh',
            backgroundSize: 'cover'
        };

        return (
            <div style={bgStyle}>
                <video className="video-fullscreen fixed" loop>
                    <source src={video} type="video/mp4" />
                </video>
            </div>
        )
    }
}

export default FullScreen
