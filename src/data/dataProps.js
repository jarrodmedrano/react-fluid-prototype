import React from 'react';

{/*
    Proptypes are evaluated at run time and will throw WARNINGS if missing
    ONLY RUNS IN DEVELOPMENT, NOT IN PRODUCTION
*/}

let string = React.PropTypes.string,
    number = React.PropTypes.number,
    requiredString = React.PropTypes.string.isRequired,
    requiredNum = React.PropTypes.number.isRequired,
    requiredObj = React.PropTypes.object.isRequired,
    requiredBool = React.PropTypes.bool.isRequired;

export let picturePropTypes = {
    pictures: React.PropTypes.arrayOf(
        React.PropTypes.shape({
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
    button: React.PropTypes.shape({
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
    ratings: React.PropTypes.shape({
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
    tiles: React.PropTypes.arrayOf(React.PropTypes.shape({
        heading: Object.assign(headingPropTypes.heading),
        size: string,
        pictures: Object.assign(picturePropTypes.pictures),
        button: Object.assign(buttonPropTypes.button)
    }))
};


export let tilePropTypes = {
  tiles: React.PropTypes.arrayOf(React.PropTypes.shape({
      heading: Object.assign(headingPropTypes.heading),
      size: string,
      pictures: Object.assign(picturePropTypes.pictures),
      button: Object.assign(buttonPropTypes.button),
      viewMask: string
  }))
};

export let mosaicPropTypes = {
  mosaic: React.PropTypes.shape({
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

export let listPropTypes = React.PropTypes.array.isRequired;

export let listItemPropTypes = React.PropTypes.string.isRequired;

export let linkPropTypes = {
    to: React.PropTypes.string.isRequired,
    children: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.object
    ]).isRequired
};

export let verticalPropTypes = {
    layout: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.object
    ]).isRequired,
    ordinal: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number
    ]).isRequired,
    groupIdentifier: requiredString,
    sectionIdentifier: requiredString
};

export let sectionPropTypes = {
    sections: React.PropTypes.arrayOf(React.PropTypes.shape({
        groupIdentifier: requiredString,
        sectionIdentifier: requiredString,
        layout: Object.assign(verticalPropTypes.layout),
        anchorLink: React.PropTypes.bool,
    }))
};

export let footerPropTypes = {
    sections: Object.assign(sectionPropTypes.sections)
};

export let verticalPagePropTypes = {
    route: React.PropTypes.object,
    groups: React.PropTypes.arrayOf(React.PropTypes.shape({
        groupIdentifier: requiredString,
        brand: React.PropTypes.shape({
            logoTab: string,
            color: string,
        }).isRequired,
        sections: Object.assign(sectionPropTypes.sections)
    }))
};

export let MainPropTypes = {
    route: React.PropTypes.object,
    groups: React.PropTypes.arrayOf(React.PropTypes.shape({
        groupIdentifier: requiredString,
        brand: React.PropTypes.shape({
            logoTab: string,
            color: string,
        }).isRequired,
        sections: Object.assign(sectionPropTypes.sections)
    }))
};

export default function dataPropTypes(component) {
    return {
        data: React.PropTypes.shape(Object.assign(component)).isRequired
    }
}
//
// MasterLayout.propTypes = {
//     routes : React.PropTypes.array.isRequired,
//     route : React.PropTypes.object.isRequired,
//     params : React.PropTypes.object.isRequired,
//     data : React.PropTypes.shape({
//         layout: string,
//         deviceInformation: React.PropTypes.object,
//         ratings: React.PropTypes.shape({
//             rating: requiredString,
//             bestRating: requiredString,
//             ratingText: requiredString,
//             reviewLink: requiredString,
//         }),
//         groups: React.PropTypes.arrayOf(React.PropTypes.shape({
//             groupIdentifier: requiredString,
//             brand: React.PropTypes.shape({
//                 logoTab: requiredString,
//                 color: requiredString,
//             }).isRequired,
//             sections: React.PropTypes.arrayOf(React.PropTypes.shape({
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
//                 pictures: React.PropTypes.arrayOf(React.PropTypes.shape({
//                     src: string,
//                     minwidth: string,
//                 })),
//                 button: React.PropTypes.shape({
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
//                 mosaic: React.PropTypes.shape({
//                     theme: string,
//                     layout: string,
//                     tiles: React.PropTypes.arrayOf(React.PropTypes.shape({
//                         heading: string,
//                         subheading: string,
//                         size: string,
//                         pictures: React.PropTypes.arrayOf(React.PropTypes.shape({
//                             src: string,
//                             minwidth: string,
//                         })),
//                         button: React.PropTypes.shape({
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
