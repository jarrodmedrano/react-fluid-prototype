import React from 'react'
import ReactWinJS from 'react-winjs';
import 'src/js/components/sidebar/SideBar.scss!';
import SpecList from 'src/js/components/speclist/SpecList.jsx!';
import ShareForm from 'src/js/components/ShareForm/ShareForm.jsx!';
import { Router, Route, Link } from 'react-router';
import classNames from 'classnames';

var styles = {
    backgroundColor: '#ececec',
    color: '#505050'
}

var SideBar = React.createClass({

    handleClick() {

        if (this.state.specsOpen) {

            this.setState({
                specsOpen: false,
                class: "section"
            });

        } else {

            this.setState({
                specsOpen: true,
                class: "section open"
            });

        }
    },

    getInitialState() {

        return {
            specsOpen: false,
            class: "section"
        }

    },

    render() {

        var expanderClass = classNames({
            'expander': true,
            'open': this.state.specsOpen,
            'closed': !this.state.specsOpen
        });

        var text = this.state.specsOpen ? 'Close tech specs' : 'See all tech specs';

        return (
            <div className="sidebar" style={styles}>
                <img src="img/surface-pro-small.png" alt="Surface Pro"/>
                <header><h1>Surface Pro 4</h1>
                    <p>The tablet that can replace your laptop.</p></header>
                <SpecList />
                <div className={expanderClass}>
                    <button className="btn-expand" onClick={this.handleClick}><span>{text}</span></button>
                    <div className="expanded-list"><SpecList />
                     <ShareForm />
                    </div>
                </div>
            </div>
        );
    }
});

export default SideBar
