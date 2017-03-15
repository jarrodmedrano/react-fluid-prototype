declare function require(s: string[], fn: Function): void;

require(['selectMenu', 'componentFactory'], (selectMenuModule: any, factoryModule: any) => {
    if (factoryModule.ComponentFactory && factoryModule.ComponentFactory.create) {
        factoryModule.ComponentFactory.create([{ 'component': selectMenuModule.SelectMenu }]);
    }
});
