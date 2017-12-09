/**
 * Created by imac-ret on 17/10/17.
 */

class Person {
    constructor () {
        this.name = 'judy';
        this.age = '20';
        this.sex = 'man';
        this.job = 'play';
    };

    says (say) {
        document.write(say +'... My job is '+ this.job +' !!');
    }
}

export default Person