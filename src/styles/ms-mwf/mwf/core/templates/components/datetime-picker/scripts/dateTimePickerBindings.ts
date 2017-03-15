declare function require(s: string[], fn: Function): void;

require(['dateTimePicker', 'componentFactory'], (dateTimePickerModule: any, factoryModule: any) => {
    if (factoryModule.ComponentFactory && factoryModule.ComponentFactory.create) {
        factoryModule.ComponentFactory.create([{ 'component': dateTimePickerModule.DateTimePicker }]);
    }
});
