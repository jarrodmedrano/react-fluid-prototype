declare function require(s: string[], fn: Function): void;

// IMPORTANT!
// Please do not use this without first chatting with the OneRF FE Platform team
// This file is a temporary one-time solution to a specific problem in OneRF
// When a better solution is engineered, this file will be deleted without notification
require(['dialog', 'componentFactory'], (dialogModule: any, factoryModule: any) => {
    if (factoryModule.ComponentFactory && factoryModule.ComponentFactory.create) {
        factoryModule.ComponentFactory.create([{ 'component': dialogModule.Dialog, 'eventToBind': 'DOMContentLoaded' }]);
    }
});