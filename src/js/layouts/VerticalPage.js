import React from 'react'
import 'src/styles/main.scss!';

import _ from 'lodash'

import Vertical from 'src/js/components/vertical/Vertical';
import Header from 'src/js/components/stickynav/Header';
import Footer from 'src/js/components/stickynav/Footer';

class VerticalPage extends React.Component {

    render() {
        let currentPage = _.find(this.props.data.routes, function(result) {
            return result.title === this.props.route.title
        }, this);

        return (
            <div>
            {currentPage.content.header ?
                <Header header={ currentPage.content.header } price={ currentPage.content.specs.default } starRating={ currentPage.content.starRating } />
                : null
            }
                <main id="main">
                    {currentPage.content.verticals ?
                        currentPage.content.verticals.map(function(result, id) {
                            return (
                                <Vertical key={id} vertical={result}  />
                            )
                        })
                        : null
                    }
                </main>
                <Footer />
            </div>
        );
    }
}

export default VerticalPage
