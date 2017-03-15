declare function require(s: string[], fn: Function): void;

require(['drawer', 'componentFactory'], (drawerModule: any, factoryModule: any) => {
    if (factoryModule.ComponentFactory && factoryModule.ComponentFactory.create) {
        factoryModule.ComponentFactory.create([{ 'component': drawerModule.Drawer }]);
    }
});