import React  from 'react'
import Scroll from 'react-scroll'
let Helpers = Scroll.Helpers;

class Element extends React.Component {
    render() {
        return (
            <div {...this.props}>
                {this.props.children}
            </div>
        )
    }
}

export default Helpers.Element(Element);