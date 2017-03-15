declare function require(s: string[], fn: Function): void;

require(['feed-hero-item', 'componentFactory'], (feedHeroItemModule: any, factoryModule: any) => {
    if (factoryModule.ComponentFactory && factoryModule.ComponentFactory.create) {
        factoryModule.ComponentFactory.create([{ 'component': feedHeroItemModule.FeedHeroItem }]);
    }
});