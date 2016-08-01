import React from 'react'
import Hero from 'src/js/components/hero/hero';
import MosaicContainer from 'src/js/components/mosaic/MosaicContainer';
import _ from 'lodash'

class HomePage extends React.Component {

    render() {

        console.log(this.props.data);

        let currentPage = _.find(this.props.data.routes, function(result) {
            return result.title === this.props.route.title
        }, this);

        return (
            <div className="main-container">
                <div>
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
                </div>
            </div>
        );
    }
}

export default HomePage
