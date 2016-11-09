import React from 'react'
import './surfacebookintro.scss'

class SurfaceBookIntro extends React.Component {
    render() {
        let lineStyle = {
            'fill': 'none',
            'stroke': '#818080',
            'strokeMiterlimit': '10'
        };
        return (
            <div className="full-width">
                <div className="hotspots">
                    <div className="hotspots-inner">
                        <div className="hotspot one">
                            <div className="copy">
                                <h2 className="c-heading c-heading-4">From laptop to
                                tablet</h2>
                                <p className="c-paragraph-4">Detach the screen from the keyboard to turn your Surface
                                    Book
                                    into a
                                    tablet. <a className="c-hyperlink" href="#slide-keyboard">Find out more</a></p>
                            </div>
                            <svg version="1.1" id="Layer_1" x="0px" y="0px"
                                 viewBox="0 0 154.5 132.2">
                                <g>
                                    <polyline className="st0" points="154.5,131.7 94.5,131.7 0.4,0.3" style={lineStyle}></polyline>
                                </g>
                            </svg>
                            <a href="#slide-keyboard">
                                <div className="circle-inner"></div>
                            </a>
                        </div>
                        <div className="hotspot two">
                            <div className="copy"><h2 className="c-heading c-heading-4">Your Creative Canvas</h2>
                                <p className="c-paragraph-4">The 6 million pixels on the PixelSense screen mean you’ll
                                    never
                                    miss a
                                    single detail. <a className="c-hyperlink" href="#slide-screen">Find out more</a></p>
                            </div>

                            <svg version="1.1" id="Layer_1" x="0px" y="0px"
                                 viewBox="0 0 154.5 132.2">
                                <g>
                                    <polyline className="st0" points="0,131.7 60,131.7 154.1,0.3" style={lineStyle}></polyline>
                                </g>
                            </svg>
                            <a href="#slide-screen">
                                <div className="circle-inner">
                                </div>
                            </a></div>
                        <div className="hotspot three">
                            <div className="copy"><h2 className="c-heading c-heading-4">Draw on your screen.</h2>
                                <p className="c-paragraph-4">Use it to draw, take notes, and get around your PC. <a
                                    className="c-hyperlink"
                                    href="#slide-apps">Find
                                    out more</a></p>
                            </div>
                            <svg viewBox="0 0 154.48 132.17">
                                <polyline style={lineStyle} className="a"
                                          points="0 131.68 60 131.68 154.08 0.29"></polyline>
                            </svg>

                            <a href="#slide-apps">
                                <div className="circle-inner"></div>
                            </a></div>
                    </div>
                </div>

                <video id="video-intro" className="video-fullscreen fixed">
                    <source src="img/vertical/hero-entrance.mp4" type="video/mp4"/>
                    Your browser does not support the video tag.
                </video>

                <video id="video-keyboard-flip" className="video-fullscreen fixed hidden">
                    <source src="img/vertical/hero-keyboard-entrance.mp4" type="video/mp4"/>
                    Your browser does not support the video tag.
                </video>

                <video id="video-keyboard-flip-reverse" className="video-fullscreen fixed hidden">
                    <source src="img/vertical/hero-keyboard-reverse.mp4" type="video/mp4"/>
                    Your browser does not support the video tag.
                </video>
            </div>
        )
    }
}

export default SurfaceBookIntro

