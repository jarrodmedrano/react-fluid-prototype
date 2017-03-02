import React  from 'react'
import Scroll from 'react-scroll'
let Helpers = Scroll.Helpers;
//This is used to determine scroll position in react-scroll library
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