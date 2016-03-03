import React from 'react'
import { Router, Route, RouteHandler, Link, IndexRoute } from 'react-router';

var SurfacePage = React.createClass({

    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
});

export default SurfacePage
