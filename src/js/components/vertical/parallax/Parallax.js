import React from 'react'

class Parallax extends React.Component {

    constructor(props) {
        super(props)

        console.log(this.props);
    }

    render() {

        let imgUrl = this.props.data.background;
        let myTitle = this.props.data.title;

        let bgStyle = {
            backgroundImage: 'url(' + imgUrl + ')',
        };

        return (
            <div className="keyboard-bg" style={bgStyle} >
                <h2 id="header1" className="c-heading-4 align-bottom hidden-text">{ myTitle }</h2>
            </div>
        )
    }
}

export default Parallax