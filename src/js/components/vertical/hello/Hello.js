//! Copyright (C) Microsoft Corporation. All rights reserved.

import React from 'react'
import './hello.scss'

class Hello extends React.Component {

    render() {
        return (
                <div className="hello-container">
                    <div className="text-center"><h2 className="c-heading-3">Start with a smile</h2>
                        <p className="c-paragraph">Windows Hello gives you a more secure way to log in, with a look<br/>
                            or a touch for
                            fast access.</p>
                        <p className="c-paragraph hello">
                            <a href="ms-retaildemo-launchbioenrollment:about" className="track-link" id="Hello-App">TRY HELLO <span
                            className="glyph-chevron-right"></span></a></p>
                        <div className="video-bg">
                            <video loop id="video-hello">
                                <source src="img/vertical/windows-hello.mp4" type="video/mp4"/>
                            </video>
                            <img src="img/vertical/hello-bg.jpg" alt="Windows Hello"/>
                        </div>
                    </div>
                </div>
        )
    }
}

export default Hello
