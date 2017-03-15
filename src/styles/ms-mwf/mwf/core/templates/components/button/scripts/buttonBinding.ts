declare function require(s: string[], fn: Function): void;

require(['button', 'componentFactory'], (buttonModule: any, factoryModule: any) => {
    if (factoryModule.ComponentFactory && factoryModule.ComponentFactory.create) {
        factoryModule.ComponentFactory.create([{ c : buttonModule.Button }]);
    }
});