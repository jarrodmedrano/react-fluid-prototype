/**
 * @file This binding file is only used for UHF modules not the service bundle.
 * We do not include this file when we generate statics for the UHF service bundle because
 * OneRF modules use RequireJS for managing dependencies while the the UHF Service relies on WebPack.
 * These differences mean we have two mechanisms for ComponentFactory creation
 * @see "uhfComponentAutoInitializer.ts" to see the UHF Service version of this file.
*/
declare function require(s: string[], fn: Function): void;
require(['jqReady!'], function() {
    require(['universalHeader', 'componentFactory'], (universalHeaderModule: any, factoryModule: any) => {
        if (factoryModule.ComponentFactory && factoryModule.ComponentFactory.create) {
            factoryModule.ComponentFactory.create([{ 'c': universalHeaderModule.UniversalHeader }]);
        }
    });
});