import _ from 'lodash';

function validateProps(props) {
    _.filter(props, function(o) { console.log(o.isRequired) });
}

export default function propsAreValid(props) {
    validateProps(props);
    if(!props.data) {
       return false
    } else {
        return true
    }
}

export function toggleRender(props, component) {
    if(!props.data) {
        return false
    } else {
        return component
    }
}