import React from 'react'
import Hero from 'src/js/components/hero/hero';
import MosaicContainer from 'src/js/components/mosaic/MosaicContainer'
import _ from 'lodash'

class DefaultPage extends React.Component {

    render() {
        let currentPage = _.find(this.props.data.routes, function(result) {
            return result.title === this.props.route.title
        }, this);



        return (
            <div>
                {currentPage.content.hero ?
                    <Hero {...currentPage.content.hero} /> : null
                }

                {currentPage.content.mosaic ?
                    <div className="c-mosaic surface-mosaic">
                        <MosaicContainer {...currentPage.content.mosaic}  />
                    </div> : null
                }
            </div>
        );
    }
}

export default DefaultPage
