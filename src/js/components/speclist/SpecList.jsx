import React from 'react'

import 'src/js/components/speclist/SpecList.scss!';
import { Router, Route, Link } from 'react-router';

var SpecList = React.createClass({

    render() {
        return (
            <div className="spec-list animate-body">
                <ul>
                    <li className="icon icon-software"><h2>Software</h2>
                        Windows 10 pro<br />
                        Microsoft Office
                    </li>
                    <li className="icon icon-hardware"><h2>Hardware</h2>
                        6th Gen Intel® Core™ m3, i5, or i7<br />
                        4GB, 8GB, or 16GB RAM
                    </li>
                    <li className="icon icon-display"><h2>Display</h2>
                        12.3” PixelSense™ display<br />
                        2736 x 1824 (267 PPI)</li>
                </ul>
            </div>
        );
    }
});

export default SpecList
