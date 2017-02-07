export function onClickHandler(e) {
    if(window.RDX) {
        e.preventDefault();
        window.RDX.externalNavigate(e.target);
    }
}

export default function propsAreValid(props) {
    if(!props) {
        if(window.RDX) {
            window.RDX.logError('Invalid prop' + props);
        } else {
            console.error('Invalid prop' + props)
        }
        return false
    } else {
        return true
    }
}



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