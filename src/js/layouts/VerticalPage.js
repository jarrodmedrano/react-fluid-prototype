import React from 'react'
import '../../styles/main.scss';

import _ from 'lodash'


import Vertical from '../components/vertical/Vertical';
import StickyBanner from '../components/stickynav/StickyBanner';
import Tabs from '../components/stickynav/Tabs';
import Footer from '../components/stickynav/Footer';

class VerticalPage extends React.Component {

    render() {

        /* TODO make names independent */

        let { ratings, specs, groups, branding } = this.props.data;

        let title = this.props.route.title;

        let currentPage = _.find(groups, function(result) {
            return result.groupIdentifier === title
        }, this);


        return (
            <div>
                <Tabs routes={this.props.routes} params={this.props.params} branding={ branding } groups={ groups } />
                <StickyBanner starRating={ ratings } price={ specs.default } branding={ branding[0] } />
                <main id="main">
                    {currentPage.sections ?
                        currentPage.sections.map(function(result, id) {
                            return (
                                <Vertical key={id} vertical={result} />
                            )
                        })
                        : null
                    }
                </main>
                {currentPage.sections ? <Footer footer={currentPage.sections} /> : null}
            </div>
        );
    }
}

export default VerticalPage
