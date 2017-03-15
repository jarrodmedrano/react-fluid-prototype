declare function require(s: string[], fn: Function): void;

require(['navigationMenu', 'componentFactory'], (navigationMenuModule: any, factoryModule: any) => {
    if (factoryModule.ComponentFactory && factoryModule.ComponentFactory.create) {
        factoryModule.ComponentFactory.create([{ 'component': navigationMenuModule.NavigationMenu }]);
    }
});
