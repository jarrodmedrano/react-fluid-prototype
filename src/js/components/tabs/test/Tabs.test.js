// import React from 'react';
// import Tabs from '../Tabs';
// import { Link, IndexLink } from 'react-router';
// import {shallow} from 'enzyme';
// import data from '../../../../data/assembleData';
// import renderer from 'react-test-renderer';
//
// describe('Tabs', () => {
//
//     let routes = [{childRoutes: [{path: "office", title: "office"}, {path: "windows", title: "windows"}], indexRoute: {title: "oem", path: "/"}}];
//
//     let myData = {
//         "layout": "VerticalPage",
//         "deviceInformation": {
//             "ManufacturerName": "Microsoft",
//             "ModelName": "Surface Book",
//             "price": "$1499",
//             "salePrice": "$1399",
//             "saleExpires": "11/1/16",
//             "label": "Starting at:",
//             "WindowsEdition": "Windows 10",
//             "rawScreenResolution": "raw Screen Resolution",
//             "ScreenSize": "Screen Size",
//             "ProcessorDescription": "Processor Description",
//             "Memory": "Memory",
//             "StorageDescription": "Storage Description"
//         },
//         "ratings": {
//             "rating": "3",
//             "bestRating": "5",
//             "ratingText": "See reviews",
//             "reviewLink": "https://www.microsoftstore.com/store/msusa/en_US/pdp/Surface-Book/productID.325716000#ratingsandreviews"
//         },
//         "groups": [{
//             "$schema": "../singleGroupSchema.json?reload",
//             "groupIdentifier": "immersiveHero",
//             "brand": {
//                 "logo": "",
//                 "logoTab": "",
//                 "selectedLogoTab": "",
//                 "color": "#3076BC",
//                 "anchorTitle": "-- Immersive Hero --"
//             },
//             "sections": [
//                 {
//                     "ordinal": 100,
//                     "groupIdentifier": "immersiveHero",
//                     "sectionIdentifier": "Immersive Hero",
//                     "anchorLink": true,
//                     "anchorTitle": "-- Center Top Dark --",
//                     "layout": {
//                         "type": "immersiveHero",
//                         "theme": "theme-dark",
//                         "alignY": "top",
//                         "headingBlock": {
//                             "heading": "-- Hero Heading --",
//                             "subheading": "-- Subheading --",
//                             "button": {
//                                 "layout": "button",
//                                 "link": "http://www.microsoft.com",
//                                 "text": "Call to action",
//                                 "ariaLabel": "ariaLabel",
//                                 "textColor": "white",
//                                 "backgroundColor": "#0078D7"
//                             }
//                         },
//                         "pictureBlock": {
//                             "altText": "AltText",
//                             "ariaLabel": "AriaLabel",
//                             "pictures": [
//                                 {
//                                     "src": "http://placehold.it/2400x1350/2F2F2F/171717",
//                                     "minWidth": "1779"
//                                 },
//                                 {
//                                     "src": "http://placehold.it/1778x1000/2F2F2F/171717",
//                                     "minWidth": "1400px"
//                                 },
//                                 {
//                                     "src": "http://placehold.it/1259x472/2F2F2F/171717",
//                                     "minWidth": "1084"
//                                 },
//                                 {
//                                     "src": "http://placehold.it/1083x609/2F2F2F/171717",
//                                     "minWidth": "768"
//                                 },
//                                 {
//                                     "src": "http://placehold.it/767x431/2F2F2F/171717",
//                                     "minWidth": "540"
//                                 },
//                                 {
//                                     "src": "http://placehold.it/539x303/2F2F2F/171717",
//                                     "minWidth": "0"
//                                 }
//                             ]
//                         }
//                     }
//                 },
//                 {
//                     "ordinal": 200,
//                     "groupIdentifier": "immersiveHero",
//                     "sectionIdentifier": "Immersive Hero",
//                     "anchorLink": true,
//                     "anchorTitle": "-- Center Bottom Dark --",
//                     "layout": {
//                         "type": "immersiveHero",
//                         "theme": "theme-dark",
//                         "alignY": "bottom",
//                         "headingBlock": {
//                             "heading": "-- Hero Heading --",
//                             "subheading": "-- Subheading --",
//                             "button": {
//                                 "layout": "button",
//                                 "link": "http://www.microsoft.com",
//                                 "text": "Call to action",
//                                 "ariaLabel": "ariaLabel",
//                                 "textColor": "white",
//                                 "backgroundColor": "#0078D7"
//                             }
//                         },
//                         "pictureBlock": {
//                             "altText": "AltText",
//                             "ariaLabel": "AriaLabel",
//                             "pictures": [
//                                 {
//                                     "src": "http://placehold.it/2400x1350/2F2F2F/171717",
//                                     "minWidth": "1779"
//                                 },
//                                 {
//                                     "src": "http://placehold.it/1778x1000/2F2F2F/171717",
//                                     "minWidth": "1400px"
//                                 },
//                                 {
//                                     "src": "http://placehold.it/1259x472/2F2F2F/171717",
//                                     "minWidth": "1084"
//                                 },
//                                 {
//                                     "src": "http://placehold.it/1083x609/2F2F2F/171717",
//                                     "minWidth": "768"
//                                 },
//                                 {
//                                     "src": "http://placehold.it/767x431/2F2F2F/171717",
//                                     "minWidth": "540"
//                                 },
//                                 {
//                                     "src": "http://placehold.it/539x303/2F2F2F/171717",
//                                     "minWidth": "0"
//                                 }
//                             ]
//                         }
//                     }
//                 }
//             ]
//         }, {
//             "$schema": "../singleGroupSchema.json?reload",
//             "groupIdentifier": "hero",
//             "brand": {
//                 "logo": "",
//                 "logoTab": "",
//                 "selectedLogoTab": "",
//                 "color": "#3076BC",
//                 "anchorTitle": "-- Hero --"
//             },
//             "sections": [
//                 {
//                     "ordinal": 100,
//                     "groupIdentifier": "hero",
//                     "sectionIdentifier": "Section1",
//                     "anchorLink": true,
//                     "anchorTitle": "-- Right Center Dark --",
//                     "layout": {
//                         "type": "hero",
//                         "theme": "theme-dark",
//                         "alignX": "right",
//                         "alignY": "center",
//                         "headingBlock": {
//                             "heading": "-- Hero Heading --",
//                             "subheading": "-- Subheading --",
//                             "paragraph": "-- Paragraph -- lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vitae convallis eros, nec iaculis nisi. Duis imperdiet elementum diam, eu tempor quam tempus sit amet. Suspendisse eu tortor quis odio faucibus tempus sed",
//                             "button": {
//                                 "layout": "button",
//                                 "link": "#/windows",
//                                 "text": "Call to action",
//                                 "ariaLabel": "ariaLabel",
//                                 "textColor": "white",
//                                 "backgroundColor": "#0078D7"
//                             }
//                         },
//                         "pictureBlock": {
//                             "altText": "AltText",
//                             "ariaLabel": "AriaLabel",
//                             "pictures": [
//                                 {
//                                     "src": "http://placehold.it/2400x1350/2F2F2F/171717",
//                                     "minWidth": "1779"
//                                 },
//                                 {
//                                     "src": "http://placehold.it/1778x1000/2F2F2F/171717",
//                                     "minWidth": "1400"
//                                 },
//                                 {
//                                     "src": "http://placehold.it/1259x472/2F2F2F/171717",
//                                     "minWidth": "1084"
//                                 },
//                                 {
//                                     "src": "http://placehold.it/1083x609/2F2F2F/171717",
//                                     "minWidth": "768"
//                                 },
//                                 {
//                                     "src": "http://placehold.it/767x431/2F2F2F/171717",
//                                     "minWidth": "540"
//                                 },
//                                 {
//                                     "src": "http://placehold.it/539x303/2F2F2F/171717",
//                                     "minWidth": "0"
//                                 }
//                             ]
//                         }
//                     }
//                 },
//                 {
//                     "ordinal": 200,
//                     "groupIdentifier": "hero",
//                     "sectionIdentifier": "Section2",
//                     "anchorLink": true,
//                     "anchorTitle": "-- Right Top Dark --",
//                     "layout": {
//                         "type": "hero",
//                         "theme": "theme-dark",
//                         "alignX": "right",
//                         "alignY": "top",
//                         "headingBlock": {
//                             "heading": "-- Hero Heading --",
//                             "subheading": "-- Subheading --",
//                             "paragraph": "-- Paragraph -- lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vitae convallis eros, nec iaculis nisi. Duis imperdiet elementum diam, eu tempor quam tempus sit amet. Suspendisse eu tortor quis odio faucibus tempus sed",
//                             "button": {
//                                 "layout": "button",
//                                 "link": "#/windows",
//                                 "text": "Call to action",
//                                 "ariaLabel": "ariaLabel",
//                                 "textColor": "white",
//                                 "backgroundColor": "#0078D7"
//                             }
//                         },
//                         "pictureBlock": {
//                             "altText": "AltText",
//                             "ariaLabel": "AriaLabel",
//                             "pictures": [
//                                 {
//                                     "src": "http://placehold.it/2400x1350/2F2F2F/171717",
//                                     "minWidth": "1779"
//                                 },
//                                 {
//                                     "src": "http://placehold.it/1778x1000/2F2F2F/171717",
//                                     "minWidth": "1400"
//                                 },
//                                 {
//                                     "src": "http://placehold.it/1259x472/2F2F2F/171717",
//                                     "minWidth": "1084"
//                                 },
//                                 {
//                                     "src": "http://placehold.it/1083x609/2F2F2F/171717",
//                                     "minWidth": "768"
//                                 },
//                                 {
//                                     "src": "http://placehold.it/767x431/2F2F2F/171717",
//                                     "minWidth": "540"
//                                 },
//                                 {
//                                     "src": "http://placehold.it/539x303/2F2F2F/171717",
//                                     "minWidth": "0"
//                                 }
//                             ]
//                         }
//                     }
//                 },
//                 {
//                     "ordinal": 300,
//                     "groupIdentifier": "hero",
//                     "sectionIdentifier": "Section3",
//                     "anchorLink": true,
//                     "anchorTitle": "-- Right Bottom Dark --",
//                     "layout": {
//                         "type": "hero",
//                         "theme": "theme-dark",
//                         "alignX": "right",
//                         "alignY": "bottom",
//                         "headingBlock": {
//                             "heading": "-- Hero Heading --",
//                             "subheading": "-- Subheading --",
//                             "paragraph": "-- Paragraph -- lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vitae convallis eros, nec iaculis nisi. Duis imperdiet elementum diam, eu tempor quam tempus sit amet. Suspendisse eu tortor quis odio faucibus tempus sed",
//                             "button": {
//                                 "layout": "button",
//                                 "link": "#/windows",
//                                 "text": "Call to action",
//                                 "ariaLabel": "ariaLabel",
//                                 "textColor": "white",
//                                 "backgroundColor": "#0078D7"
//                             }
//                         },
//                         "pictureBlock": {
//                             "altText": "AltText",
//                             "ariaLabel": "AriaLabel",
//                             "pictures": [
//                                 {
//                                     "src": "http://placehold.it/2400x1350/2F2F2F/171717",
//                                     "minWidth": "1779"
//                                 },
//                                 {
//                                     "src": "http://placehold.it/1778x1000/2F2F2F/171717",
//                                     "minWidth": "1400"
//                                 },
//                                 {
//                                     "src": "http://placehold.it/1259x472/2F2F2F/171717",
//                                     "minWidth": "1084"
//                                 },
//                                 {
//                                     "src": "http://placehold.it/1083x609/2F2F2F/171717",
//                                     "minWidth": "768"
//                                 },
//                                 {
//                                     "src": "http://placehold.it/767x431/2F2F2F/171717",
//                                     "minWidth": "540"
//                                 },
//                                 {
//                                     "src": "http://placehold.it/539x303/2F2F2F/171717",
//                                     "minWidth": "0"
//                                 }
//                             ]
//                         }
//                     }
//                 },
//                 {
//                     "ordinal": 400,
//                     "groupIdentifier": "hero",
//                     "sectionIdentifier": "Section4",
//                     "anchorLink": true,
//                     "anchorTitle": "-- Center Center Dark --",
//                     "layout": {
//                         "type": "hero",
//                         "theme": "theme-dark",
//                         "alignX": "center",
//                         "alignY": "center",
//                         "headingBlock": {
//                             "heading": "-- Hero Heading --",
//                             "subheading": "-- Subheading --",
//                             "paragraph": "-- Paragraph -- lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vitae convallis eros, nec iaculis nisi. Duis imperdiet elementum diam, eu tempor quam tempus sit amet. Suspendisse eu tortor quis odio faucibus tempus sed",
//                             "button": {
//                                 "layout": "button",
//                                 "link": "#/windows",
//                                 "text": "Call to action",
//                                 "ariaLabel": "ariaLabel",
//                                 "textColor": "white",
//                                 "backgroundColor": "#0078D7"
//                             }
//                         },
//                         "pictureBlock": {
//                             "altText": "AltText",
//                             "ariaLabel": "AriaLabel",
//                             "pictures": [
//                                 {
//                                     "src": "http://placehold.it/2400x1350/2F2F2F/171717",
//                                     "minWidth": "1779"
//                                 },
//                                 {
//                                     "src": "http://placehold.it/1778x1000/2F2F2F/171717",
//                                     "minWidth": "1400"
//                                 },
//                                 {
//                                     "src": "http://placehold.it/1259x472/2F2F2F/171717",
//                                     "minWidth": "1084"
//                                 },
//                                 {
//                                     "src": "http://placehold.it/1083x609/2F2F2F/171717",
//                                     "minWidth": "768"
//                                 },
//                                 {
//                                     "src": "http://placehold.it/767x431/2F2F2F/171717",
//                                     "minWidth": "540"
//                                 },
//                                 {
//                                     "src": "http://placehold.it/539x303/2F2F2F/171717",
//                                     "minWidth": "0"
//                                 }
//                             ]
//                         }
//                     }
//                 },
//                 {
//                     "ordinal": 500,
//                     "groupIdentifier": "hero",
//                     "sectionIdentifier": "Section5",
//                     "anchorLink": true,
//                     "anchorTitle": "-- Center Top Dark --",
//                     "layout": {
//                         "type": "hero",
//                         "theme": "theme-dark",
//                         "alignX": "center",
//                         "alignY": "top",
//                         "headingBlock": {
//                             "heading": "-- Hero Heading --",
//                             "subheading": "-- Subheading --",
//                             "paragraph": "-- Paragraph -- lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vitae convallis eros, nec iaculis nisi. Duis imperdiet elementum diam, eu tempor quam tempus sit amet. Suspendisse eu tortor quis odio faucibus tempus sed",
//                             "button": {
//                                 "layout": "button",
//                                 "link": "#/windows",
//                                 "text": "Call to action",
//                                 "ariaLabel": "ariaLabel",
//                                 "textColor": "white",
//                                 "backgroundColor": "#0078D7"
//                             }
//                         },
//                         "pictureBlock": {
//                             "altText": "AltText",
//                             "ariaLabel": "AriaLabel",
//                             "pictures": [
//                                 {
//                                     "src": "http://placehold.it/2400x1350/2F2F2F/171717",
//                                     "minWidth": "1779"
//                                 },
//                                 {
//                                     "src": "http://placehold.it/1778x1000/2F2F2F/171717",
//                                     "minWidth": "1400"
//                                 },
//                                 {
//                                     "src": "http://placehold.it/1259x472/2F2F2F/171717",
//                                     "minWidth": "1084"
//                                 },
//                                 {
//                                     "src": "http://placehold.it/1083x609/2F2F2F/171717",
//                                     "minWidth": "768"
//                                 },
//                                 {
//                                     "src": "http://placehold.it/767x431/2F2F2F/171717",
//                                     "minWidth": "540"
//                                 },
//                                 {
//                                     "src": "http://placehold.it/539x303/2F2F2F/171717",
//                                     "minWidth": "0"
//                                 }
//                             ]
//                         }
//                     }
//                 },
//                 {
//                     "ordinal": 600,
//                     "groupIdentifier": "hero",
//                     "sectionIdentifier": "Section6",
//                     "anchorLink": true,
//                     "anchorTitle": "-- Center Bottom Dark --",
//                     "layout": {
//                         "type": "hero",
//                         "theme": "theme-dark",
//                         "alignX": "center",
//                         "alignY": "bottom",
//                         "headingBlock": {
//                             "heading": "-- Hero Heading --",
//                             "subheading": "-- Subheading --",
//                             "paragraph": "-- Paragraph -- lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vitae convallis eros, nec iaculis nisi. Duis imperdiet elementum diam, eu tempor quam tempus sit amet. Suspendisse eu tortor quis odio faucibus tempus sed",
//                             "button": {
//                                 "layout": "button",
//                                 "link": "#/windows",
//                                 "text": "Call to action",
//                                 "ariaLabel": "ariaLabel",
//                                 "textColor": "white",
//                                 "backgroundColor": "#0078D7"
//                             }
//                         },
//                         "pictureBlock": {
//                             "altText": "AltText",
//                             "ariaLabel": "AriaLabel",
//                             "pictures": [
//                                 {
//                                     "src": "http://placehold.it/2400x1350/2F2F2F/171717",
//                                     "minWidth": "1779"
//                                 },
//                                 {
//                                     "src": "http://placehold.it/1778x1000/2F2F2F/171717",
//                                     "minWidth": "1400"
//                                 },
//                                 {
//                                     "src": "http://placehold.it/1259x472/2F2F2F/171717",
//                                     "minWidth": "1084"
//                                 },
//                                 {
//                                     "src": "http://placehold.it/1083x609/2F2F2F/171717",
//                                     "minWidth": "768"
//                                 },
//                                 {
//                                     "src": "http://placehold.it/767x431/2F2F2F/171717",
//                                     "minWidth": "540"
//                                 },
//                                 {
//                                     "src": "http://placehold.it/539x303/2F2F2F/171717",
//                                     "minWidth": "0"
//                                 }
//                             ]
//                         }
//                     }
//                 },
//                 {
//                     "ordinal": 700,
//                     "groupIdentifier": "hero",
//                     "sectionIdentifier": "Section7",
//                     "anchorLink": true,
//                     "anchorTitle": "-- Left Center Dark --",
//                     "layout": {
//                         "type": "hero",
//                         "theme": "theme-dark",
//                         "alignX": "left",
//                         "alignY": "center",
//                         "headingBlock": {
//                             "heading": "-- Hero Heading --",
//                             "subheading": "-- Subheading --",
//                             "paragraph": "-- Paragraph -- lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vitae convallis eros, nec iaculis nisi. Duis imperdiet elementum diam, eu tempor quam tempus sit amet. Suspendisse eu tortor quis odio faucibus tempus sed",
//                             "button": {
//                                 "layout": "button",
//                                 "link": "#/windows",
//                                 "text": "Call to action",
//                                 "ariaLabel": "ariaLabel",
//                                 "textColor": "white",
//                                 "backgroundColor": "#0078D7"
//                             }
//                         },
//                         "pictureBlock": {
//                             "altText": "AltText",
//                             "ariaLabel": "AriaLabel",
//                             "pictures": [
//                                 {
//                                     "src": "http://placehold.it/2400x1350/2F2F2F/171717",
//                                     "minWidth": "1779"
//                                 },
//                                 {
//                                     "src": "http://placehold.it/1778x1000/2F2F2F/171717",
//                                     "minWidth": "1400"
//                                 },
//                                 {
//                                     "src": "http://placehold.it/1259x472/2F2F2F/171717",
//                                     "minWidth": "1084"
//                                 },
//                                 {
//                                     "src": "http://placehold.it/1083x609/2F2F2F/171717",
//                                     "minWidth": "768"
//                                 },
//                                 {
//                                     "src": "http://placehold.it/767x431/2F2F2F/171717",
//                                     "minWidth": "540"
//                                 },
//                                 {
//                                     "src": "http://placehold.it/539x303/2F2F2F/171717",
//                                     "minWidth": "0"
//                                 }
//                             ]
//                         }
//                     }
//                 },
//                 {
//                     "ordinal": 800,
//                     "groupIdentifier": "hero",
//                     "sectionIdentifier": "Section7",
//                     "anchorLink": true,
//                     "anchorTitle": "-- Left Top Dark --",
//                     "layout": {
//                         "type": "hero",
//                         "theme": "theme-dark",
//                         "alignX": "left",
//                         "alignY": "top",
//                         "headingBlock": {
//                             "heading": "-- Hero Heading --",
//                             "subheading": "-- Subheading --",
//                             "paragraph": "-- Paragraph -- lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vitae convallis eros, nec iaculis nisi. Duis imperdiet elementum diam, eu tempor quam tempus sit amet. Suspendisse eu tortor quis odio faucibus tempus sed",
//                             "button": {
//                                 "layout": "button",
//                                 "link": "#/windows",
//                                 "text": "Call to action",
//                                 "ariaLabel": "ariaLabel",
//                                 "textColor": "white",
//                                 "backgroundColor": "#0078D7"
//                             }
//                         },
//                         "pictureBlock": {
//                             "altText": "AltText",
//                             "ariaLabel": "AriaLabel",
//                             "pictures": [
//                                 {
//                                     "src": "http://placehold.it/2400x1350/2F2F2F/171717",
//                                     "minWidth": "1779"
//                                 },
//                                 {
//                                     "src": "http://placehold.it/1778x1000/2F2F2F/171717",
//                                     "minWidth": "1400"
//                                 },
//                                 {
//                                     "src": "http://placehold.it/1259x472/2F2F2F/171717",
//                                     "minWidth": "1084"
//                                 },
//                                 {
//                                     "src": "http://placehold.it/1083x609/2F2F2F/171717",
//                                     "minWidth": "768"
//                                 },
//                                 {
//                                     "src": "http://placehold.it/767x431/2F2F2F/171717",
//                                     "minWidth": "540"
//                                 },
//                                 {
//                                     "src": "http://placehold.it/539x303/2F2F2F/171717",
//                                     "minWidth": "0"
//                                 }
//                             ]
//                         }
//                     }
//                 },
//                 {
//                     "ordinal": 900,
//                     "groupIdentifier": "hero",
//                     "sectionIdentifier": "Section8",
//                     "anchorLink": true,
//                     "anchorTitle": "-- Left Bottom Dark --",
//                     "layout": {
//                         "type": "hero",
//                         "theme": "theme-dark",
//                         "alignX": "left",
//                         "alignY": "bottom",
//                         "headingBlock": {
//                             "heading": "-- Hero Heading --",
//                             "subheading": "-- Subheading --",
//                             "paragraph": "-- Paragraph -- lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vitae convallis eros, nec iaculis nisi. Duis imperdiet elementum diam, eu tempor quam tempus sit amet. Suspendisse eu tortor quis odio faucibus tempus sed",
//                             "button": {
//                                 "layout": "button",
//                                 "link": "#/windows",
//                                 "text": "Call to action",
//                                 "ariaLabel": "ariaLabel",
//                                 "textColor": "white",
//                                 "backgroundColor": "#0078D7"
//                             }
//                         },
//                         "pictureBlock": {
//                             "altText": "AltText",
//                             "ariaLabel": "AriaLabel",
//                             "pictures": [
//                                 {
//                                     "src": "http://placehold.it/2400x1350/2F2F2F/171717",
//                                     "minWidth": "1779"
//                                 },
//                                 {
//                                     "src": "http://placehold.it/1778x1000/2F2F2F/171717",
//                                     "minWidth": "1400"
//                                 },
//                                 {
//                                     "src": "http://placehold.it/1259x472/2F2F2F/171717",
//                                     "minWidth": "1084"
//                                 },
//                                 {
//                                     "src": "http://placehold.it/1083x609/2F2F2F/171717",
//                                     "minWidth": "768"
//                                 },
//                                 {
//                                     "src": "http://placehold.it/767x431/2F2F2F/171717",
//                                     "minWidth": "540"
//                                 },
//                                 {
//                                     "src": "http://placehold.it/539x303/2F2F2F/171717",
//                                     "minWidth": "0"
//                                 }
//                             ]
//                         }
//                     }
//                 }
//             ]
//         }]
//     };
//
//     // it('should click', () => {
//     //     const spy = jasmine.createSpy();
//     //     const wrapper = shallow(<Tabs data={myData} routes={routes} />);
//     //     // wrapper.find('a').simulate('click');
//     //     // expect(spy).toHaveBeenCalled();
//     //     expect(wrapper).toMatchSnapshot();
//     // });
//     //
//     it('should render without exploding', () => {
//         const component = renderer.create(
//             <Tabs data={myData} routes={routes} />
//         );
//         let tree = component.toJSON();
//         expect(tree).toMatchSnapshot();
//     });
// });