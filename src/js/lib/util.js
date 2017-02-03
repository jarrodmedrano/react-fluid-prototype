export function onClickHandler(e) {
    if(window.RDX) {
        e.preventDefault();
        window.RDX.externalNavigate(e.target);
    }
}

export default function propsAreValid(props, required) {
    if(!props) {
        if(window.RDX) {
            window.RDX.logErrorString('Invalid prop' + props);
        } else {
            console.error('Invalid prop' + props)
        }
        return false
    } else {
        return true
    }
}
