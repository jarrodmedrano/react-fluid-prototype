declare function require(s: string[], fn: Function): void;

require(['multiHeroItem', 'componentFactory'], (multiHeroItemModule: any, factoryModule: any) => {
    if (factoryModule.ComponentFactory && factoryModule.ComponentFactory.create) {
        factoryModule.ComponentFactory.create([{ 'component': multiHeroItemModule.MultiHeroItem }]);
    }
});