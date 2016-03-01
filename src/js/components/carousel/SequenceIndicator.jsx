import React from 'react';

var SequenceIndicator = React.createClass({

    render() {
        return(
            <button role="radio" aria-checked={this.props.myKey === this.props.activeSlide ? 'true': 'false'} aria-label={this.props.slideTitle} aria-controls="hero-slide-one" title={this.props.slideTitle} onClick={() => this.props.updateSlide(this.props.myKey)}></button>
        )
    }
});

export default SequenceIndicator