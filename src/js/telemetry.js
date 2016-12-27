export default function onClickHandler(e) {
    if(window.RDX) {
        e.preventDefault();
        window.RDX.externalNavigate(e.target);
    }
}