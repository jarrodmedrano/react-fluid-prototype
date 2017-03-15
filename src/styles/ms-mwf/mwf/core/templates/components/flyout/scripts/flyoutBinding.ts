declare function require(s: string[], fn: Function): void;

require(['flyout', 'componentFactory'], (flyoutModule: any, factoryModule: any) => {
    if (factoryModule.ComponentFactory && factoryModule.ComponentFactory.create) {
        factoryModule.ComponentFactory.create([{ 'component': flyoutModule.Flyout}]);
    }
});