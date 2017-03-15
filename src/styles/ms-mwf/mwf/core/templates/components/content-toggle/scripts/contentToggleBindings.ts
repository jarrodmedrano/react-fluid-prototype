declare function require(s: string[], fn: Function): void;

require(['contentToggle', 'componentFactory'], (contentToggleModule: any, factoryModule: any) => {
    if (factoryModule.ComponentFactory && factoryModule.ComponentFactory.create) {
        factoryModule.ComponentFactory.create([{ 'component': contentToggleModule.ContentToggle }]);
    }
});