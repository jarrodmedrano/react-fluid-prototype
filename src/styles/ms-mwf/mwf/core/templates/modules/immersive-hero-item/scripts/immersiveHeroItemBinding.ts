declare function require(s: string[], fn: Function): void;

require(['immersiveHeroItem', 'componentFactory'], (immersiveHeroItemModule: any, factoryModule: any) => {
    if (factoryModule.ComponentFactory && factoryModule.ComponentFactory.create) {
        factoryModule.ComponentFactory.create([{ 'component': immersiveHeroItemModule.ImmersiveHeroItem }]);
    }
});