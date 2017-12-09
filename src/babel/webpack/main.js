/**
 * Created by imac-ret on 17/10/17.
 */

import Student from './student.js';
import Cat from './cat.js';
import './index.css';

var run = () => {
    let cat = new Cat();
    cat.says('free cat1 !!');

    let stu = new Student();
    stu.says('free student !!');
}

run();