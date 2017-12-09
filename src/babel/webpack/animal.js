/**
 * Created by imac-ret on 17/10/17.
 */
class Animal {
    constructor () {
        this.type = 'animal';
    };

    says (say) {
        document.write(say +'... This is a '+ this.type +'!!');
    }
}

export {Animal};