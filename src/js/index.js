import React from 'react'
import ReactDOM from 'react-dom'
import { Router, DefaultRoute, Route, Link, IndexRoute, hashHistory, useRouterHistory} from 'react-router'
import TransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import { createHashHistory } from 'history';
const appHistory = useRouterHistory(createHashHistory)({ queryKey: false });
import 'fetch';

//Components
import Linkband from 'src/js/components/linkband/linkband';
import HomePage from 'src/js/components/pages/HomePage';
import DefaultPage from 'src/js/components/pages/DefaultPage';


//Styles
import 'src/styles/main.scss!';
import 'src/styles/mwf_en-us_default.min.css!';

import data from 'src/js/data/data.json!';

var App = React.createClass({

    getInitialState: function() {

        return {
            data: ''
        };
    },

    fetchStuff() {

    },

    componentWillMount() {

    },

    componentDidMount: function() {
        fetch('src/js/data/data.json')
            .then(function(response) {
                return response.json()
            }).then(function(json) {
            console.log('parsed json', json)
            this.setState({
                data: json
            });
        }.bind(this)).catch(function(ex) {
            console.log('parsing failed', ex)
        })
    },

    componentWillUnmount: function() {

    },


    render() {



        return (
            <div className="grid">
                <Linkband routes={this.props.routes} params={this.props.params}/>
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
});


ReactDOM.render(

        <Router history={appHistory}>
            <Route path="/" component={App}>
                {data.routes.filter(function(result, id) {
                    if(result.type !== 'IndexRoute') {
                        return false
                    }
                    return true;
                }).map(function(result, id) {
                    return <IndexRoute component={HomePage} key={id} title={result.title}/>;
                })}
                {data.routes.filter(function(result, id) {
                    if(result.type === 'IndexRoute') {
                        return false
                    }
                    return true;
                }).map(function(result, id) {
                    return <Route component={DefaultPage} key={id} path={result.path} title={result.title}/>;
                })}
            </Route>
        </Router>
    , document.getElementById('app')
);
