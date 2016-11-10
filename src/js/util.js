export default function propsAreValid(props, required) {
    if(!props || typeof props != 'object') {
        return false
    } else {
        return true
    }
}
