import React from 'react';

export let picturePropTypes = {
    data: React.PropTypes.shape({
        pictures: React.PropTypes.arrayOf(
            React.PropTypes.shape({
                src: React.PropTypes.string,
                minwidth: React.PropTypes.string,
            })
        )
    }).isRequired
};

export let ratingsPropTypes = {
    data: React.PropTypes.shape({
        ratings: React.PropTypes.shape({
            rating: React.PropTypes.string.isRequired,
            bestRating: React.PropTypes.string.isRequired,
            ratingText: React.PropTypes.string.isRequired,
            reviewLink: React.PropTypes.string.isRequired,
        })
    }).isRequired
};

export default picturePropTypes;