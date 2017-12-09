/**
 * Created by imac-ret on 17/10/17.
 */
    import {Animal} from './animal.js';

class Cat extends Animal {
    constructor () {
        super();
        this.type = 'cat';
    }
}

export default Cat;