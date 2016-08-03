import React from 'react'
import classNames from 'classnames';

import SurfaceBookIntro from 'src/js/components/vertical/surfaceintro/SurfaceBookIntro';
import Parallax from 'src/js/components/vertical/parallax/Parallax';

class Vertical extends React.Component {

    render() {

        console.log(this.props.vertical.type);

        let verticalClass = classNames('scene-vertical', this.props.vertical.type);

        return (
            <section className={verticalClass}>
                {this.props.vertical.type === 'surfacebookintro' ?
                    <SurfaceBookIntro /> : null
                }
            </section>
        )
    }
}

export default Vertical