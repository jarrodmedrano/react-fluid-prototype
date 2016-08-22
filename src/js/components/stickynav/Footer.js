import React from 'react'

class Footer extends React.Component {

    render() {
        return (
            <div className="sticky-banner sticky-footer">
                <a href="#slide-intro" className="c-action-trigger" role="button" id="anchor1">Explore Surface Book</a>
                <a href="#slide-keyboard" className="c-action-trigger c-glyph glyph-keyboard mdl-glyph" role="button" id="anchor2">Keyboard</a>
                <a href="#slide-screen" className="c-action-trigger c-glyph glyph-screen mdl-glyph" role="button"
                   id="anchor3">Screen</a>
                <a href="#slide-surface-pen" className="c-action-trigger c-glyph glyph-draw mdl-glyph" role="button" id="anchor4">Surface
                    Pen</a>
                <a href="#slide-apps" className="c-action-trigger c-glyph glyph-apps mdl-glyph" role="button" id="anchor5">Apps</a>
                <a href="#slide-accessories" className="c-action-trigger c-glyph glyph-headphones mdl-glyph" role="button" id="anchor6">Accessories</a>
            </div>
        )
    }
}

export default Footer