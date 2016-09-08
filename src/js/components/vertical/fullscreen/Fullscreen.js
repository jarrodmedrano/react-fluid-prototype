import React from 'react'
import './fullscreen.scss'

class Fullscreen extends React.Component {

    render() {

        let { title, videoUrl, bgUrl, fgUrl } = this.props.data;

        let bgStyle = {
            backgroundImage: 'url(' + bgUrl + ')',
            width: '100vw',
            height: '100vh',
            backgroundSize: 'cover'
        };

        return (
            <div style={bgStyle}>
                {fgUrl ?
                    <img src={fgUrl} alt={title} className="overlay" />
                        : null
                }
                {videoUrl ?
                <video className="video-fullscreen fixed" loop id="video-pen">
                    <source src={videoUrl} type="video/mp4" />
                </video> : null
                }
            </div>
        )
    }
}

export default Fullscreen
