import React from 'react'

import SurfaceBookIntro from 'src/js/components/vertical/surfaceintro/SurfaceBookIntro';
import Parallax from 'src/js/components/vertical/parallax/Parallax';

class Vertical extends React.Component {

    render() {

        let results = this.props.verticals;

        return (
               <div>
                    {results.verticals.map(function(result, id) {
                        return <Mosaic key={id} mosaic={result} />
                    })}
               </div>
        )
    }
}

export default Vertical