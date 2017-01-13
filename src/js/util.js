//Common Functions
export function onClickHandler(e) {
    if(window.RDX) {
        e.preventDefault();
        window.RDX.externalNavigate(e.target);
    }
}

export default function propsAreValid(props, required) {
    if(!props) {
        return false
    } else {
        return true
    }
}