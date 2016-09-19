import React from 'react'
import '../../styles/main.scss';

import * as _ from 'lodash'

import Vertical from '../components/vertical/Vertical';
import StickyBanner from '../components/stickynav/Header';
import Tabs from '../components/stickynav/Tabs';
import Footer from '../components/stickynav/Footer';

class VerticalPage extends React.Component {

    render() {

        let currentPage = _.find(this.props.data.pages);

        let ratings = _.find(this.props.data.ratings);

        let specs = _.find(this.props.data.specs);

        let branding = _.find(this.props.data.branding);


        return (
            <div>
                <Tabs routes={this.props.routes} params={this.props.params} />
                <StickyBanner starRating={ ratings } price={ specs } branding={ branding } />
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
