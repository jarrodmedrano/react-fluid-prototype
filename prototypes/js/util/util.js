import _ from 'lodash';

const chainablePropType = predicate => {
    const propType = (props, propName, componentName) => {
        // don't do any validation if empty
        if (props[propName] == null) {
            return;
        }

        return predicate(props, propName, componentName);
    };

    propType.isRequired = (props, propName, componentName) => {
        // warn if empty
        if (props[propName] == null) {
            return new Error(`Required prop \`${propName}\` was not specified in \`${componentName}\`.`);
        }

        return predicate(props, propName, componentName);
    };

    return propType;
};

export var customProp = chainablePropType(() => {

});