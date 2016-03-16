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
            <div className="main-container">
                {currentPage.content.hero ?
                    <div><Hero {...currentPage.content.hero} /></div> : null
                }

                {currentPage.content.mosaicContainer ?
                    <div className="c-mosaic surface-mosaic">
                        {currentPage.content.mosaicContainer.map(function(result, id) {
                            return (
                              <MosaicContainer key={id} mosaics={result}  />
                            )
                        })}
                    </div>
                     : null
                }
            </div>
        );
    }
}

export default DefaultPage
