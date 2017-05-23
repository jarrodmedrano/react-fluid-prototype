//Check if Window.RDX exists, if not, load data from dummyData
import data from '../data/assembleData';

window.RDX ? window.datasource = JSON.parse(window.RDX.datasource) : window.datasource = data;

export const myData = window.datasource;
export const Index = myData.groups[0];
export const Routes = myData.groups.filter(function (result, index) {
        return result;
});
export const home = Index.groupIdentifier;
