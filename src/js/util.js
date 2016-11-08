import _ from 'lodash';

function createChainableTypeChecker(validate) {
    function checkType(isRequired, props, propName, componentName, location) {
        componentName = componentName || ANONYMOUS;
        if (props[propName] == null) {
            var locationName = ReactPropTypeLocationNames[location];
            if (isRequired) {
                return new Error(
                    ("Required " + locationName + " `" + propName + "` was not specified in ") +
                    ("`" + componentName + "`.")
                );
            }
            return null;
        } else {
            return validate(props, propName, componentName, location);
        }
    }

    let chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
}

export default function validateProp (props, propName, componentName, location) {
    componentName = componentName || 'ANONYMOUS';

    if (props[propName]) {
        let value = props[propName];
        if (typeof value === 'string') {
            return value.length <= 140 ? null : new Error(propName + ' in ' + componentName + " is longer than 140 characters");
        }
    }

    // assume all ok
    return null;
}


//
// function validateProps(props) {
//     _.filter(props, function(o) { console.log(o.isRequired) });
// }
//
// export default function propsAreValid(props, proptypes) {
//    let myProps = _.reduce(props, function(newVal, previousVal, key) {
//
//
//        return previousVal
//    });
//
//     console.log(myProps);
//
//     if(!props.data) {
//        return false
//     } else {
//         return true
//     }
// }
//
// export function toggleRender(props, component) {
//     if(!props.data) {
//         return false
//     } else {
//         return component
//     }
// }