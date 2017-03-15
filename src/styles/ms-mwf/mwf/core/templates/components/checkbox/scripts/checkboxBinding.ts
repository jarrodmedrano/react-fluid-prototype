declare function require(s: string[], fn: Function): void;

require(['checkbox', 'componentFactory'], (checkboxModule: any, factoryModule: any) => {
    if (factoryModule.ComponentFactory && factoryModule.ComponentFactory.create) {
        factoryModule.ComponentFactory.create([{ 'component': checkboxModule.Checkbox }]);
    }
});