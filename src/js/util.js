export default function propsAreValid(props) {
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