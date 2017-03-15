declare function require(s: string[], fn: Function): void;
require(['jqReady!'], function() {
    require(['uhfMeControl', 'componentFactory'], (uhfMeControlModule: any, factoryModule: any) => {
        if (factoryModule.ComponentFactory && factoryModule.ComponentFactory.create) {
            factoryModule.ComponentFactory.create([{ 'c': uhfMeControlModule.UhfMeControl, eventToBind:'DOMContentLoaded' }]);
        }
    });
});