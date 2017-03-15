declare function require(s: string[], fn: Function): void;

require(['pageBehaviors', 'componentFactory'], (pageBehaviorsFactory: any, factoryModule: any) => {
    if (factoryModule.ComponentFactory && factoryModule.ComponentFactory.create) {
        factoryModule.ComponentFactory.create([{ 'component': pageBehaviorsFactory.PageBehaviors }]);
    }
});