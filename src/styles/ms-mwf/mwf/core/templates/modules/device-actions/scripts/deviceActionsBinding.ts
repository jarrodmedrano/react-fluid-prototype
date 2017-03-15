declare function require(s: string[], fn: Function): void;

require(['deviceActions', 'componentFactory'], (deviceActionsModule: any, factoryModule: any) => {
    if (factoryModule.ComponentFactory && factoryModule.ComponentFactory.create) {
        factoryModule.ComponentFactory.create([{ 'component': deviceActionsModule.DeviceActions }]);
    }
});
