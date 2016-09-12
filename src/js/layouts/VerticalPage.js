import React from 'react'
import '../../styles/main.scss';

import * as _ from 'lodash'

import Vertical from '../components/vertical/Vertical';
import Header from '../components/stickynav/Header';
import Footer from '../components/stickynav/Footer';

class VerticalPage extends React.Component {

    render() {

        let currentPage = _.find(this.props.data.pages);

        let ratings = _.find(this.props.data.ratings);

        let specs = _.find(this.props.data.specs);

        let branding = _.find(this.props.data.branding);

        console.log(branding.title);

        return (
            <div>

                <Header starRating={ ratings } price={ specs }  branding={ branding } />
                <main id="main">
                    {currentPage.sections.verticals ?
                        currentPage.sections.verticals.map(function(result, id) {
                            return (
                                <Vertical key={id} vertical={result} />
                            )
                        })
                        : null
                    }
                </main>

                {currentPage.sections.verticals ? <Footer footer={currentPage.sections.verticals} /> : null}
            </div>
        );
    }
}

export default VerticalPage
