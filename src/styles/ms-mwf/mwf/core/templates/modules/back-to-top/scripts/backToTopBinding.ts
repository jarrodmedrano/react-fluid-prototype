declare function require(s: string[], fn: Function): void;

require(['backToTop', 'componentFactory'], (backToTopModule: any, factoryModule: any) => {
    if (factoryModule.ComponentFactory && factoryModule.ComponentFactory.create) {
        factoryModule.ComponentFactory.create([{ 'component': backToTopModule.BackToTop }]);
    }
});