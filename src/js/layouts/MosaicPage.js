import React from 'react'
import Hero from 'src/js/components/hero/hero';
import MosaicContainer from 'src/js/components/mosaic/MosaicContainer'
import Carousel from 'src/js/components/carousel/Carousel';
import 'src/styles/mosaic.scss!';
import 'src/styles/mwf_en-us_default.min.css!';

import _ from 'lodash'

class MosaicPage extends React.Component {

    render() {
        let currentPage = _.find(this.props.data.routes, function(result) {
            return result.title === this.props.route.title
        }, this);

        return (
            <div className="main-container">

                {currentPage.content.hero ?
                    <Hero {...currentPage.content.hero} /> : null
                }

                {currentPage.content.mosaicContainer ?
                    <div className="c-mosaic fullscreen-mosaic">
                        {currentPage.content.mosaicContainer.map(function(result, id) {
                            return (
                              <MosaicContainer key={id} mosaics={result}  />
                            )
                        })}
                    </div>
                     : null
                }

                {currentPage.content.carousel ?
                    <Carousel fullscreen={currentPage.content.carousel.fullscreen} {...currentPage.content.carousel} /> : null
                }

            </div>
        );
    }
}

export default MosaicPage
