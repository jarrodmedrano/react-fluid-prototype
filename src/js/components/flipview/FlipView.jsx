import React from 'react'

import { Router, Route, Link } from 'react-router';
import 'src/js/components/flipview/FlipView.scss';


var FlipView = React.createClass({

    getInitialState () {

        let slides = this.props.slides;

        return {
            flipList: new WinJS.Binding.List(slides),
            windowHeight: window.innerHeight
        };
    },

    handleResize(e) {
        this.setState({windowHeight: window.innerHeight});
    },

    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
    },

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    },

    flipViewItemRenderer: ReactWinJS.reactRenderer(function (item) {


        let slideBG = {
            background: item.data.bg ? item.data.bg : '',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat'
        };

        let slideBtn = {
            borderColor: item.data.btnborder,
            color: item.data.btncolor
        };

        return (
            <div data-win-control="WinJS.Binding.Template">
                <div className="overlaidItemTemplate">
                    {item.data.icon ? <img className="slide-icon" src={item.data.icon} /> : ''}
                    <div className="image" style={slideBG}></div>
                    <div className="overlay">
                        <h1>{item.data.title}<br />
                            {item.data.text}
                        </h1>
                        <button style={slideBtn}><span>{item.data.buttonText}</span></button>
                    </div>
                </div>
            </div>
        );
    }),

    render() {
        return (
            <ReactWinJS.FlipView
                style={{width: '100%', height: (this.state.windowHeight - 62)}}
                className="win-type-body"
                itemDataSource={this.state.flipList.dataSource}
                itemTemplate={this.flipViewItemRenderer} />
        );
    }
});

export default FlipView