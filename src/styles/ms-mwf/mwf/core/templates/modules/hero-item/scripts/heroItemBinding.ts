declare function require(s: string[], fn: Function): void;

require(['heroItem', 'componentFactory'], (heroItemModule: any, factoryModule: any) => {
    if (factoryModule.ComponentFactory && factoryModule.ComponentFactory.create) {
        factoryModule.ComponentFactory.create([{ 'component': heroItemModule.HeroItem }]);
    }
});