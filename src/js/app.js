import React from 'react'
import ReactDOM from 'react-dom'
import {Router, Route, IndexRoute, browserHistory} from 'react-router'
import TransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import AsyncProps from 'async-props'

//Components
import VerticalPage from './layouts/VerticalPage';

document.addEventListener('DOMContentLoaded', function () {

    if(process.env.NODE_ENV === 'dev') {
        myData = require('../data/hubRoot.json');
    } else {
        myData = window.datasource;
    }

    /* TODO make groups name independent */

    var Index = myData.groups[0];

    var Routes = myData.groups.filter(function(result, index) {
        if(index > 0) {
          return result;
        }
    });

    function handleUpdate() {
        let {
            action
        } = this.state.location;

        if (action === 'PUSH') {
            window.scrollTo(0, 0);
        }
    }

    ReactDOM.render(
        <VerticalPage data={myData} title="oem" />
        , document.getElementById('app')
    );
});

var myData = {};

class App extends React.Component {

    static loadProps(params, cb) {
        cb(null, {
            data: myData
        })
    }

    render() {
        const data = this.props.data;

        return (
            <div>
                <TransitionGroup component="div" transitionName="page-transition"
                                 transitionEnterTimeout={500} transitionLeaveTimeout={500}>
                    {React.cloneElement(this.props.children, {
                        key: this.props.location.pathname,
                        data: data
                    })}
                </TransitionGroup>
            </div>
        );
    }
}