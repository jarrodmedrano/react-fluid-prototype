import React from 'react'
// System.import('./fullscreenVideo.scss!');

class Video extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        let { title, video, foregroundImage, backgroundImage } = this.props.data;

        let bgStyle = {
            backgroundImage: 'url(' + backgroundImage + ')',
            width: '100vw',
            height: '100vh',
            backgroundSize: 'cover'
        };

        return (
            <div style={bgStyle}>
                {foregroundImage ?
                    <img src={foregroundImage} alt={title} className="overlay" />
                        : null
                }
                <video className="video-fullscreen fixed" loop id="video-pen">
                    <source src={video} type="video/mp4" />
                </video>
            </div>
        )
    }
}

export default Video
