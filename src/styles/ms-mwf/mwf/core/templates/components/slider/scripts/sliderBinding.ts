declare function require(s: string[], fn: Function): void;

require(['slider', 'componentFactory'], (sliderModule: any, factoryModule: any) => {
    if (factoryModule.ComponentFactory && factoryModule.ComponentFactory.create) {
        factoryModule.ComponentFactory.create([{ 'component': sliderModule.Slider }]);
    }
});
