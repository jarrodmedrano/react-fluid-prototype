import React from 'react'

class Fullscreen extends React.Component {

    render() {

        let { videoUrl } = this.props.data;

        return (
            <div>
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
