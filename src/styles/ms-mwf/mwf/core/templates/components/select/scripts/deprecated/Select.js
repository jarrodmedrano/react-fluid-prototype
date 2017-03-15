import {addClass} from '../../../deprecated/helpers.js';
import SelectMenu from '../../../components/select-menu/scripts/deprecated/SelectMenu.js';

let Select = function(el) {
    this.element = el;

    return this.init();
};

Select.prototype.init = function() {
    this.selectControl = this.element.querySelector('select');
    this.selectOptions = this.element.querySelectorAll('option');

    this.buildSelectMenu();

    var selectMenus  = this.element.querySelectorAll('.c-select-menu, .c-select-menu .c-menu-item.f-sub-menu');
    selectMenus = this.initializeUI(selectMenus, SelectMenu);
};

Select.prototype.initializeUI = function(elementList, init) {
    var storage = [];

    for (var i = 0; i < elementList.length; i++) {
        storage.push(new init(elementList[i]));
    }

    return storage;
};

Select.prototype.buildSelectMenu = function() {
    // Create replacement elements
    this.selectDiv = document.createElement('div');
    addClass(this.selectDiv, 'c-select-menu');
    addClass(this.selectDiv, 'f-persist');

    this.selectMenu = document.createElement('a');
    this.selectMenu.setAttribute('aria-haspopup', true);
    this.selectMenu.setAttribute('aria-expanded', false);
    this.selectMenu.setAttribute('role', 'button');
    this.selectMenu.setAttribute('href', '#');
    this.selectMenu.appendChild(document.createTextNode("Select Menu"));

    this.selectList = document.createElement('ul');
    this.selectList.setAttribute('aria-hidden', true);
    addClass(this.selectList, 'c-menu');

    for (var i=0; i<this.selectOptions.length; i++) {
        var li = document.createElement('li');
        var a = document.createElement('a');

        addClass(li, 'c-menu-item');
        a.setAttribute('href', '#');
        a.appendChild(document.createTextNode(this.selectOptions[i].text));

        li.appendChild(a);
        this.selectList.appendChild(li);
    }

    // Add to DOM
    this.selectDiv.appendChild(this.selectMenu);
    this.selectDiv.appendChild(this.selectList);
    this.element.appendChild(this.selectDiv);
};

export default Select;