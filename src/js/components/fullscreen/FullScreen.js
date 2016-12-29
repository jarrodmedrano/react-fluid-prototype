import React from 'react'
import Heading from '../heading/Heading';
import '../hero/Hero.scss!';
import Picture from '../picture/Picture';
import './fullscreen.scss!'

class FullScreen extends React.Component {

    render() {

        let { video } = this.props.data;

        let bgStyle = {
            width: '100vw',
            height: '100vh',
            backgroundSize: 'cover'
        };

        if(video) {
            return (
                <div style={bgStyle}>
                    <video className="video-fullscreen fixed" loop>
                        <source src={video} type="video/mp4" />
                    </video>
                </div>
            )
        } else {
            return (
                <section className="m-image-intro f-transparent f-align-center theme-light">
                    <Picture data={this.props.data}/>
                    <Heading data={this.props.data}/>
                </section>
            )
        }
    }
}

export default FullScreen
