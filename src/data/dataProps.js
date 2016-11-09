import React from 'react';
{/*
    Proptypes are evaluated at run time and will throw WARNINGS if missing
    ONLY RUNS IN DEVELOPMENT, NOT IN PRODUCTION
*/}

export let picturePropTypes = {
    pictures: React.PropTypes.arrayOf(
        React.PropTypes.shape({
            src: React.PropTypes.string,
            minwidth: React.PropTypes.string,
        })
    )
};

export let headingPropTypes = {
    heading: React.PropTypes.string,
    subheading: React.PropTypes.string,
    paragraph: React.PropTypes.string
};

export let buttonPropTypes = {
    button: React.PropTypes.shape({
        layout: React.PropTypes.string,
        path: React.PropTypes.string,
        title: React.PropTypes.string,
        ariaLabel: React.PropTypes.string,
        textColor: React.PropTypes.string,
        backgroundColor: React.PropTypes.string,
    })
};

export let ratingsPropTypes = {
    ratings: React.PropTypes.shape({
        rating: React.PropTypes.string.isRequired,
        bestRating: React.PropTypes.string.isRequired,
        ratingText: React.PropTypes.string.isRequired,
        reviewLink: React.PropTypes.string.isRequired,
    })
};

export default function dataPropTypes(component) {
    return {
        data: React.PropTypes.shape(Object.assign(component)).isRequired
    }
}