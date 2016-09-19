import React from 'react'
import './tabs.scss'

class Tabs extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {

        return (
            <div className="tabs">
                <ul>
                    <li><a className="active"></a></li>
                </ul>
            </div>
        )
    }
}

export default Tabs