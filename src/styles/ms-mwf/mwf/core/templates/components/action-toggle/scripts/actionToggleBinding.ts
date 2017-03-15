declare function require(s: string[], fn: Function): void;

require(['actionToggle', 'componentFactory'], (actionToggleModule: any, factoryModule: any) => {
    if (factoryModule.ComponentFactory && factoryModule.ComponentFactory.create) {
        factoryModule.ComponentFactory.create([{ 'component': actionToggleModule.ActionToggle }]);
    }
});