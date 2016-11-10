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

export let devicePropTypes = {
  ManufacturerName: React.PropTypes.string,
  ModelName: React.PropTypes.string,
  price: React.PropTypes.string,
  salePrice: React.PropTypes.string,
  saleExpires: React.PropTypes.string,
  label: React.PropTypes.string,
}

export let tilePropTypes = {
  tiles: React.PropTypes.arrayOf(React.PropTypes.shape({
      headingPropTypes,
      size: React.PropTypes.string,
      picturePropTypes,
      buttonPropTypes
  }))
}

export let mosaicPropTypes = {
  mosaic: React.PropTypes.shape({
      theme: React.PropTypes.string,
      layout: React.PropTypes.string,
      tilePropTypes
  }),
}

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
//         layout: React.PropTypes.string,
//         deviceInformation: React.PropTypes.object,
//         ratings: React.PropTypes.shape({
//             rating: React.PropTypes.string.isRequired,
//             bestRating: React.PropTypes.string.isRequired,
//             ratingText: React.PropTypes.string.isRequired,
//             reviewLink: React.PropTypes.string.isRequired,
//         }),
//         groups: React.PropTypes.arrayOf(React.PropTypes.shape({
//             groupIdentifier: React.PropTypes.string.isRequired,
//             brand: React.PropTypes.shape({
//                 logoTab: React.PropTypes.string.isRequired,
//                 color: React.PropTypes.string.isRequired,
//             }).isRequired,
//             sections: React.PropTypes.arrayOf(React.PropTypes.shape({
//                 groupIdentifier: React.PropTypes.string.isRequired,
//                 sectionIdentifier: React.PropTypes.string.isRequired,
//                 layout: React.PropTypes.string.isRequired,
//                 anchorLink: React.PropTypes.string.isRequired,
//                 title: React.PropTypes.string.isRequired,
//                 heading: React.PropTypes.string,
//                 subheading: React.PropTypes.string,
//                 paragraph: React.PropTypes.string,
//                 altText: React.PropTypes.string,
//                 ariaLabel: React.PropTypes.string,
//                 pictures: React.PropTypes.arrayOf(React.PropTypes.shape({
//                     src: React.PropTypes.string,
//                     minwidth: React.PropTypes.string,
//                 })),
//                 button: React.PropTypes.shape({
//                     layout: React.PropTypes.string,
//                     path: React.PropTypes.string,
//                     title: React.PropTypes.string,
//                     ariaLabel: React.PropTypes.string,
//                     textColor: React.PropTypes.string,
//                     backgroundColor: React.PropTypes.string,
//                 }),
//                 alignX: React.PropTypes.string,
//                 alignY: React.PropTypes.string,
//                 theme: React.PropTypes.string,
//                 video: React.PropTypes.string,
//                 mosaic: React.PropTypes.shape({
//                     theme: React.PropTypes.string,
//                     layout: React.PropTypes.string,
//                     tiles: React.PropTypes.arrayOf(React.PropTypes.shape({
//                         heading: React.PropTypes.string,
//                         subheading: React.PropTypes.string,
//                         size: React.PropTypes.string,
//                         pictures: React.PropTypes.arrayOf(React.PropTypes.shape({
//                             src: React.PropTypes.string,
//                             minwidth: React.PropTypes.string,
//                         })),
//                         button: React.PropTypes.shape({
//                             layout: React.PropTypes.string,
//                             path: React.PropTypes.string,
//                             title: React.PropTypes.string,
//                             ariaLabel: React.PropTypes.string,
//                             textColor: React.PropTypes.string,
//                             backgroundColor: React.PropTypes.string,
//                         }),
//                     }))
//                 }),
//             })).isRequired,
//         })).isRequired,
//     }),
// };
