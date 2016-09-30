import React from 'react'
import './fullscreen.scss'

class FullBleed extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            videoUrl: require(`img/${this.props.data.videoUrl}`)
        };
    }

    render() {

        let { title, bgUrl, fgUrl } = this.props.data;

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
                <video className="video-fullscreen fixed" loop id="video-pen">
                    <source src={this.state.videoUrl} type="video/mp4" />
                </video>
            </div>
        )
    }
}

export default FullBleed
