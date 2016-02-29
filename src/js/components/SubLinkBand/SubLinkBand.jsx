import React from 'react'

import 'src/js/components/SubLinkBand/SubLinkBand.scss!';
import { Router, Route, Link, IndexLink, IndexRoute } from 'react-router';
import _ from 'lodash';

var SubLinkBand = React.createClass({
    mixins:[Router.State],

    render() {

       
        
        return (
                <div className="sub-linkband">
                    <div className="win-linkband">
                        <ul>
                            {innerRouteChildren.map((item, index) =>
                            <li key={index}>
                                <Link
                                    activeClassName="active"
                                    to={item.path || ''}>
                                    {item.title}
                                </Link>
                                <span
                                    className="ghost">
                                   {item.title}
                                </span>
                                {(index + 1) < depth}
                            </li>
                                )}
                        </ul>
                    </div>
                </div>
        );
    }
});

export default SubLinkBand
