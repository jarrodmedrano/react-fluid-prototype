declare function require(s: string[], fn: Function): void;

require(['video', 'componentFactory'], (videoModule: any, factoryModule: any) => {
    if (factoryModule.ComponentFactory && factoryModule.ComponentFactory.create) {
        factoryModule.ComponentFactory.create([{ component: videoModule.Video, eventToBind: 'DOMContentLoaded' }]);
    }
});
