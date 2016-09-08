import React from 'react'
import './scene-apps.scss!'

class Apps extends React.Component {

    render() {


        return (
            <div className="device">
                <div className="text-center header-offset"><h2 className="c-heading-3">Work the way you want</h2>
                    <p className="c-paragraph">Surface Book transforms from a laptop into two additional configurations,<br/>adapting
                        to the way that you work and the places where you create.</p></div>
                <div className="clipboard">
                    <div className="surface-pen">
                        <img src="img/vertical/clipboard-pen.png" />
                    </div>
                    <br/>
                    <div className="clipboard-bg">
                        <div className="clipboard-screen">
                            <video id="video-one-note">
                                <source src="img/vertical/one-note.mp4" type="video/mp4" />
                            </video>
                            <video id="video-fresh-paint" className="video-toggle">
                                <source src="img/vertical/fresh-paint.mp4" type="video/mp4" />
                            </video>
                        </div>
                        <img src="img/vertical/clipboard-clipboard.png" alt="Clipboard" width="700"/></div>

                    <div id="parallax-foreground" className="parallax-foreground">
                        <div className="app-block svg">
                            <div className="onenote-content">

                                <h3 className="c-heading-4">
                                    <img src="img/vertical/one-note-logo.svg" alt="OneNote" />
                                    <strong>OneNote</strong>
                                </h3>
                                <p className="c-paragraph-4">Work together, keep it together, use it anywhere. All your notes on all your devices. Get OneNote free.</p>
                            </div>
                            <div className="group"><a href="ms-retaildemo://OneNote/demonote.one" className="c-call-to-action c-glyph c-glyph-go" id="OneNote-App"><span>EXPLORE WITH ONENOTE</span></a></div>
                        </div>

                        <div className="freshpaint-bg app-block app-block-secondary">
                            <div className="onenote-content">

                                <h3 className="c-heading-4">
                                    <img src="img/vertical/fresh-paint-logo.png" alt="Fresh Paint" />
                                    <strong>OneNote</strong>
                                </h3>
                                <p className="c-paragraph-4">Capture everything from your smallest doodles to your biggest ideas all in one place, no matter where you are.</p>
                            </div>
                            <div className="group"><a href="ms-retaildemo://demopaint.fppx" className="c-call-to-action c-glyph c-glyph-go" id="OneNote-App"><span>EXPLORE WITH FRESH PAINT</span></a></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Apps