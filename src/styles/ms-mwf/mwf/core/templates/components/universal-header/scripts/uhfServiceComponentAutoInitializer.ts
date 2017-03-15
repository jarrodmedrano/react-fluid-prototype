/// <amd-module name="uhfServiceComponentAutoInitializer"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.
import {ComponentFactory} from 'componentFactory';
import {UniversalHeader} from 'universalHeader';
import {UhfMeControl} from 'uhfMeControl';

// This class left blank on purpose. It's required for the webpack bundle to work.
export class UHFComponentAutoInitializer {
}

// A self executor that will create the UHF Component for the UHF Service.
(() => {
    ComponentFactory.create([{ 'c': UniversalHeader }]);
    ComponentFactory.create([{ 'c': UhfMeControl, eventToBind:'DOMContentLoaded' }]);
})();
