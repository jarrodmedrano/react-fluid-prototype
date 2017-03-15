declare function require(s: string[], fn: Function): void;

require(['inPageNavigation', 'componentFactory'], (inpageNavigationModule: any, factoryModule: any) => {
    if (factoryModule.ComponentFactory && factoryModule.ComponentFactory.create) {
        factoryModule.ComponentFactory.create([{ 'component': inpageNavigationModule.InPageNavigation }]);
    }
});