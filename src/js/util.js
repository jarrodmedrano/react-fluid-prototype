export default function propsAreValid(props, required) {
    if(!props) {
        return false
    } else {
        return true
    }
}

export function* entries(obj) {
    for(let key of Object.keys(obj)) {
        yield [key, obj[key]];
    }
}