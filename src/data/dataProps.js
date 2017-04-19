import React from 'react';
import PropTypes from 'prop-types';

{/*
    Proptypes are evaluated at run time and will throw WARNINGS if missing
    ONLY RUNS IN DEVELOPMENT, NOT IN PRODUCTION
*/}

let string = PropTypes.string,
    number = PropTypes.number,
    requiredString = PropTypes.string.isRequired,
    requiredNum = PropTypes.number.isRequired,
    requiredObj = PropTypes.object.isRequired,
    requiredBool = PropTypes.bool.isRequired;

export let picturePropTypes = {
    pictures: PropTypes.arrayOf(
        PropTypes.shape({
            src: string.isRequired,
            minwidth: string,
        })
    ),
    altText: string
};

export let MosaicPicturePropTypes = picturePropTypes;

export let headingPropTypes = {
    heading: string,
    subheading: string,
    paragraph: string
};

export let buttonPropTypes = {
    button: PropTypes.shape({
        layout: string,
        link: string,
        text: string,
        ariaLabel: string,
        textColor: string,
        backgroundColor: string,
        toPage: string
    })
};

export let buttonInterface = {
    button: {
        layout: string,
        link: string,
        text: string,
        ariaLabel: string,
        textColor: string,
        backgroundColor: string,
    }
};

export let ratingsPropTypes = {
    ratings: PropTypes.shape({
        rating: requiredString,
        bestRating: requiredString,
        ratingText: requiredString,
        reviewLink: requiredString,
    })
};

export let devicePropTypes = {
  ManufacturerName: string,
  ModelName: string,
  price: string,
  salePrice: string,
  saleExpires: string,
  label: string,
};

export let containerPropTypes = {
    mosaicLayout: string,
    theme: string,
    tiles: PropTypes.arrayOf(PropTypes.shape({
        heading: Object.assign(headingPropTypes.heading),
        size: string,
        pictures: Object.assign(picturePropTypes.pictures),
        button: Object.assign(buttonPropTypes.button)
    }))
};


export let tilePropTypes = {
  tiles: PropTypes.arrayOf(PropTypes.shape({
      heading: Object.assign(headingPropTypes.heading),
      size: string,
      pictures: Object.assign(picturePropTypes.pictures),
      button: Object.assign(buttonPropTypes.button),
      viewMask: string
  }))
};

export let mosaicPropTypes = {
  mosaic: PropTypes.shape({
      theme: string,
      layout: string,
      tiles: Object.assign(tilePropTypes.tiles)
  }),
};

export let heroPropTypes = {
    alignX: string,
    alignY: string,
    theme: string,
    layout: string,
    viewMask: string,
    badge: string,
    pictures: Object.assign(picturePropTypes.pictures),
    button: Object.assign(buttonPropTypes.button)
};

export let listPropTypes = PropTypes.array.isRequired;

export let listItemPropTypes = PropTypes.string.isRequired;

export let linkPropTypes = {
    to: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
    ]).isRequired
};

export let verticalPropTypes = {
    layout: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
    ]).isRequired,
    ordinal: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    groupIdentifier: requiredString,
    sectionIdentifier: requiredString
};

export let sectionPropTypes = {
    sections: PropTypes.arrayOf(PropTypes.shape({
        groupIdentifier: requiredString,
        sectionIdentifier: requiredString,
        layout: Object.assign(verticalPropTypes.layout),
        anchorLink: PropTypes.bool,
    }))
};

export let footerPropTypes = {
    sections: Object.assign(sectionPropTypes.sections)
};

export let verticalPagePropTypes = {
    route: PropTypes.object,
    groups: PropTypes.arrayOf(PropTypes.shape({
        groupIdentifier: requiredString,
        brand: PropTypes.shape({
            logoTab: string,
            color: string,
        }).isRequired,
        sections: Object.assign(sectionPropTypes.sections)
    }))
};

export let MainPropTypes = {
    route: PropTypes.object,
    groups: PropTypes.arrayOf(PropTypes.shape({
        groupIdentifier: requiredString,
        brand: PropTypes.shape({
            logoTab: string,
            color: string,
        }).isRequired,
        sections: Object.assign(sectionPropTypes.sections)
    }))
};

export default function dataPropTypes(component) {
    return {
        data: PropTypes.shape(Object.assign(component)).isRequired
    }
}
//
// MasterLayout.propTypes = {
//     routes : PropTypes.array.isRequired,
//     route : PropTypes.object.isRequired,
//     params : PropTypes.object.isRequired,
//     data : PropTypes.shape({
//         layout: string,
//         deviceInformation: PropTypes.object,
//         ratings: PropTypes.shape({
//             rating: requiredString,
//             bestRating: requiredString,
//             ratingText: requiredString,
//             reviewLink: requiredString,
//         }),
//         groups: PropTypes.arrayOf(PropTypes.shape({
//             groupIdentifier: requiredString,
//             brand: PropTypes.shape({
//                 logoTab: requiredString,
//                 color: requiredString,
//             }).isRequired,
//             sections: PropTypes.arrayOf(PropTypes.shape({
//                 groupIdentifier: requiredString,
//                 sectionIdentifier: requiredString,
//                 layout: requiredObj,
//                 anchorLink: requiredString,
//                 title: requiredString,
//                 heading: string,
//                 subheading: string,
//                 paragraph: string,
//                 altText: string,
//                 ariaLabel: string,
//                 pictures: PropTypes.arrayOf(PropTypes.shape({
//                     src: string,
//                     minwidth: string,
//                 })),
//                 button: PropTypes.shape({
//                     layout: string,
//                     link: string,
//                     title: string,
//                     ariaLabel: string,
//                     textColor: string,
//                     backgroundColor: string,
//                 }),
//                 alignX: string,
//                 alignY: string,
//                 theme: string,
//                 video: string,
//                 mosaic: PropTypes.shape({
//                     theme: string,
//                     layout: string,
//                     tiles: PropTypes.arrayOf(PropTypes.shape({
//                         heading: string,
//                         subheading: string,
//                         size: string,
//                         pictures: PropTypes.arrayOf(PropTypes.shape({
//                             src: string,
//                             minwidth: string,
//                         })),
//                         button: PropTypes.shape({
//                             layout: string,
//                             link: string,
//                             title: string,
//                             ariaLabel: string,
//                             textColor: string,
//                             backgroundColor: string,
//                         }),
//                     }))
//                 }),
//             })).isRequired,
//         })).isRequired,
//     }),
// };
