import React from 'react'

class Video extends React.Component {

    render() {

        let { title, video, foregroundImage, backgroundImage } = this.props.data;

        let bgStyle = {
            width: '100vw',
            height: '100vh',
            backgroundSize: 'cover'
        };

        let bgImg = {
            backgroundImage: 'url(' + backgroundImage + ')'
        };

        return (
            <div style={backgroundImage ? Object.assign(bgStyle, bgImg) : bgStyle}>
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
