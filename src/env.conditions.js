export var environment;

if(!window.RDX) {
    environment = 'dev';
} else {
    environment = 'prod';
}