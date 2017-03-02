// import dummyData from './hubRoot.json!';
import dummyHero from './new/dummyHero.json!';
import dummyMosaic from './new/dummyMosaic.json!';
import dummyIHero from './new/dummyIHero.json!';
import dummyFullScreen from './new/dummyFullScreen.json!';
import dummySurfacePro from './new/dummySurfacePro.json!';
import dummyFVideo from './new/dummyFVideo.json!';
import dummySurfaceGroup from './dummySurfaceGroup.json!';
import dummyOEM from './legacy/dummyOEM.json!';
import dummyOffice from './legacy/dummyOffice.json!';
import dummyRetailer from './legacy/dummyRetailer.json!';
import dummyWindows from './legacy/dummyWindows.json!';
import dummyDefault from './legacy/dummyDefault.json!';
import dummyStyle from './legacy/dummyStyleExample.json!';
import dummyHp from './legacy/dummyHP.json!';
//dummyData.groups.push(dummyHero, dummyMosaic, dummyIHero, dummyFullScreen);

let defaultVertical = {
    "layout": "VerticalPage",
    "deviceInformation": {
        "ManufacturerName": "Microsoft",
        "ModelName": "Surface Book",
        "price": "$1499",
        "salePrice": "$1399",
        "saleExpires": "11/1/16",
        "label": "Starting at:"
    },
    "ratings": {
        "rating": "3",
        "bestRating": "5",
        "ratingText": "See reviews",
        "reviewLink": "https://www.microsoftstore.com/store/msusa/en_US/pdp/Surface-Book/productID.325716000#ratingsandreviews"
    },
    "groups": []
};
//Sample fscreen video by itself
//defaultVertical.groups.push(dummyFVideo, dummyRetailer);
//sample surface data
//defaultVertical.groups.push(dummySurfaceGroup, dummyRetailer);
//Sample retailer data
defaultVertical.groups.push(dummyOEM, dummyOffice, dummyRetailer, dummyWindows);
//let data = defaultVertical;
//HP data
let data = dummyHp;
export default data;