import React from 'react'
import '../../styles/main.scss';

import * as _ from 'lodash'

import Vertical from '../components/vertical/Vertical';
import StickyBanner from '../components/stickynav/StickyBanner';
import Tabs from '../components/stickynav/Tabs';
import Footer from '../components/stickynav/Footer';

class VerticalPage extends React.Component {

    render() {

        /* TODO make names independent */

        let { ratings, specs, groups, branding } = this.props.data;

        return (
            <div>
                <Tabs routes={this.props.routes} params={this.props.params} branding={ branding } />
                <StickyBanner starRating={ ratings } price={ specs } branding={ branding[0] } />
                <main id="main">
                    {groups.sections ?
                        groups.sections.map(function(result, id) {
                            return (
                                <Vertical key={id} vertical={result} />
                            )
                        })
                        : null
                    }
                </main>

                {groups.sections ? <Footer footer={groups.sections} /> : null}
            </div>
        );
    }
}

export default VerticalPage
