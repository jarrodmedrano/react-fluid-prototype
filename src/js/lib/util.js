export function externalNavigate(e) {
    if(window.RDX) {
        e.preventDefault();
        window.RDX.externalNavigate(e.target);
    }
}

export function navigateEvent(group, section) {
    if(window.RDX) {
        window.RDX.navigateEvent(visible, group, section);
    }
}

export function impressionEvent(group, section) {
    if(window.RDX) {
        window.RDX.impressionEvent(group, section);
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