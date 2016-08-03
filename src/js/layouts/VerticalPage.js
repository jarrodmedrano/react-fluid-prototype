import React from 'react'
import 'src/styles/main.scss!';

import _ from 'lodash'

import Vertical from 'src/js/components/vertical/Vertical';

class VerticalPage extends React.Component {

    render() {
        let currentPage = _.find(this.props.data.routes, function(result) {
            return result.title === this.props.route.title
        }, this);

        return (
            <main id="main">
                {currentPage.content.verticals ?
                    <section className="scene-vertical">
                    {currentPage.content.verticals.map(function(result, id) {
                        return (
                            <Vertical key={id} vertical={result}  />
                        )
                    })}
                    </section>
                    : null
                }
            </main>
        );
    }
}

export default VerticalPage
