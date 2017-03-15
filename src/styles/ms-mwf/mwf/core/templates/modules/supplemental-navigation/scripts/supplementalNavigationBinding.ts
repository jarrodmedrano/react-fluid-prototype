declare function require(s: string[], fn: Function): void;

require(['supplementalNavigation', 'componentFactory'], (supplementalNavigationModule: any, factoryModule: any) => {
    if (factoryModule.ComponentFactory && factoryModule.ComponentFactory.create) {
        factoryModule.ComponentFactory.create([{ 'component': supplementalNavigationModule.SupplementalNavigation }]);
    }
});