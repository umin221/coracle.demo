/**
 * Created by imac-ret on 17/10/18.
 */

class Phone {

    constructor () {
        this.shape = '长方体';
        this.version = 'android 8.0';
    };

    call (phone) {
        document.write(this.shape +' , call phone to '+ phone);
    };

}

export default Phone;