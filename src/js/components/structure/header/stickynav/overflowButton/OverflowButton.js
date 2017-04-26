import React, {Component} from 'react';
import classNames from 'classnames';

class OverflowButton extends Component {

    constructor(props) {
        super(props);
        this.state = {active: false};
    }

    _handleClick() {
        this.setState({active: !this.state.active});
    }

    render() {
        let templateClass = classNames({active: this.state.active}, `overflow-buttons-container`);

        return (
            <div>
                <button className="c-action-trigger ellipsis" onClick={() => {this._handleClick()}}><span></span></button>
                <div className={templateClass}>{this.props.children}</div>
            </div>
        )
    }
}

export default OverflowButton;