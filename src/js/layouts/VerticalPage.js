import React from 'react'
import '../../styles/main.scss';

import * as _ from 'lodash'

import Vertical from '../components/vertical/Vertical';
import StickyBanner from '../components/stickynav/Header';
import Tabs from '../components/stickynav/Tabs';
import Footer from '../components/stickynav/Footer';

class VerticalPage extends React.Component {

    render() {

        let { currentPage, ratings, specs, branding } = _.find(this.props.data);

        return (
            <div>
                <Tabs />
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
