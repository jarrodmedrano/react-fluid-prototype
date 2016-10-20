import React from 'react'
import classNames from 'classnames';
import './mosaic.scss!'
import Picture from '../picture/Picture';
import Heading from '../heading/Heading';

class Mosaic extends React.Component {

    render() {

        return (
            <div>
                {this.props.data.mosaics ?
                    this.props.data.mosaics.map(function (array, id) {
                        return (
                            <div className="theme-dark" key={id}>
                                <section className="c-mosaic-placement f-background-neutral-90">
                                    <Picture data={array} />
                                </section>
                            </div>)
                    }, this)
                    : null }
            </div>
        )
    }
}

export default Mosaic

