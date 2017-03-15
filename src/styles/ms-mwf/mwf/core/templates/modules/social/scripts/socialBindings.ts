declare function require(s: string[], fn: Function): void;

require(['social', 'componentFactory'], (socialModule: any, factoryModule: any) => {
    if (factoryModule.ComponentFactory && factoryModule.ComponentFactory.create) {
        factoryModule.ComponentFactory.create([{ 'component': socialModule.Social }]);
    }
});
