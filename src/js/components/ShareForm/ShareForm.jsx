import React from 'react'

import 'src/js/components/ShareForm/ShareForm.scss!';
import SpecList from 'src/js/components/speclist/SpecList.jsx!';
import { Router, Route, Link } from 'react-router';
import classNames from 'classnames';

var styles = {
    backgroundImage: 'url(img/bgShareForm.png)',
    backgroundRepeat: 'no-repeat',
    backgroundColor: '#1c87bd'
}

var ShareForm = React.createClass({

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
            'form-expander': true,
            'open': this.state.specsOpen,
            'closed': !this.state.specsOpen
        });

        var text = this.state.specsOpen ? 'Close tech specs' : 'See all tech specs';

        return (
            <div className="share-form">
                <div className={expanderClass}>
                    <button className="btn-share" onClick={this.handleClick}><span>Tap to Share Specs</span></button>
                    <form className="share-form">
                        <h3 className="win-h3">Surface Pro 4</h3>
                        <p>The tablet that can replace your laptop.</p>
                        <label>Enter your email</label>
                        <input type="text" placeholder="Darrin@live.com" className="win-textbox" />
                        <label>Write some notes for your mail</label>
                        <textarea className="win-textarea" defaultValue="Sample text for edit showing a very, very, very, long string that wraps for a total of three glorious lines"></textarea>
                        <button><span>send the specs</span></button>
                    </form>
                </div>
            </div>
        );
    }
});

export default ShareForm