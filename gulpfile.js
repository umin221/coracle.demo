/**
 * Created by umin.
 */
'use strict';
/*=======================================
 =            Requiring stuffs          =
 ========================================*/
var config = require('./config')
    , baseWebpack = require('./webpack.base')
    , gulp = require('gulp')
    , rimraf = require('gulp-rimraf')
    , zip = require('gulp-zip')
    , through = require('through2')
    , fs = require('fs')
    , path = require('path')
    , inquirer = require('inquirer')
    , webpack = require("webpack")
    , request = require('request')
    , modules = []
    , selectModule = []
    , spinner = null
    , data = {}
    , JSESSIONID = ''
    ;

/*====================================
 =     Report Errors to Console      =
 ====================================*/
gulp.on('error', function (e) {
    throw (e);
});

/*====================================
 =            clean dist Task        =
 ====================================*/
gulp.task('clean_dist', function () {
    return gulp.src(
        ['./zip'], {read: false}
    ).pipe(rimraf());
});

/*====================================
 =           get module Task         =
 ====================================*/
gulp.task('get_modules', function () {
    return gulp.src([path.join(config.src, '/*')])
        .pipe(through.obj(function (file, enc, cb) {
            modules.push(file.relative);
            cb();
        }));
});

/*===============================================
 =             Task select_modules              =
 ================================================*/
gulp.task('select_modules', ['get_modules'], function (done) {
    var mod = ''
        , entry = {}
        , isSelectAll = gulp.env._ && gulp.env._.length && gulp.env._[0] == 'compile_all'
        ;
    inquirer.prompt([{
        type: 'checkbox',
        name: 'select',
        message: '选择要打包的模块:',
        choices: modules,
        default: isSelectAll ? modules : []
    }], function (answers) {
        selectModule = answers.select;
        for (var i = 0, l = selectModule.length; i < l; i++) {
            mod = selectModule[i];
            if (mod == 'public') continue;
            entry[mod] = config.src +'/'+ mod +'/config.js';
        };
        baseWebpack.config.entry = entry;
        done();
    });
});

gulp.task('build', ['select_modules'], function(done, args) {
    baseWebpack.buildPlug();
    webpack(baseWebpack.config, function(err, stats) {
        if(err) throw new err;
        console.log("[webpack:build]", stats.toString({
            colors: true
        }));
        done();
    });
})

/*===============================================
 =                    zip Task                  =
 ================================================*/
gulp.task('compile', ['clean_dist', 'build'], function (done) {
    var entry = baseWebpack.config.entry;
    for (var key in entry) {
        gulp.src(['!**/*.map', './' + config.build + '/' + key + '/**'], {base: config.build})
            .pipe(zip(key + '.zip'))
            .pipe(gulp.dest(config.dist));
    }
    done();
});

/*===============================================
 =                  zip all Task                =
 ================================================*/
gulp.task('compile_all', ['compile'], function () {
    console.log('应用编译完成...')
});

/*===================================
 =            login Task        ['compile'],     =
 ====================================*/
gulp.task('login', ['compile'], function (done) {
    var loginInfo = config.server.login;
    request(
        {
            url: loginInfo.url,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            form: loginInfo.data
        },
        function (err, httpResponse, body) {
            if (err) {
                return console.error('failed:', err);
            }
            JSESSIONID = httpResponse.headers['set-cookie'][0].split(';')[0].split('=')[1];
            done();
        }
    );
});

/*
 ====================================
 =         upload zip Task            =
 ====================================*/
gulp.task('upload', ['getFid'], function (done) {
    var uploadInfo = config.server.upload
        , formData = uploadInfo.data
        , j = request.jar()
        , cookie = request.cookie('JSESSIONID='+ JSESSIONID)
        , count = 0, module
        ;
    j.setCookie(cookie, uploadInfo.url);

    for (var i = 0, l = selectModule.length; i < l; i++) {
        module = selectModule[i];
        if (!module || !data[module]) continue;

        console.log('准备上传模块' + module);
        formData['function.id'] = data[module];
        formData['versionFile'] = {
            value: fs.createReadStream(__dirname +'/dist/'+ module +'.zip'),
            options: {
                filename: module +'.zip',
                contentType: 'application/x-zip-compressed'
            }
        };

        request.post({
            url: uploadInfo.url,
            headers: {
                'Content-Type': 'multipart/form-data;'
            },
            formData: formData,
            jar: j
        }, function optionalCallback (err, httpResponse, body) {
            if (err) {
                console.log(module +'上传失败');
                return console.error('failed:', err);
            }
            console.log('successful!'+ module +' has upload!');
            count += 1;
            if (count === l) {
                done();
            }
        });
    }
});

gulp.task('getFid', ['login'], function (done) {
    console.log('会话ID  JSESSIONID=' + JSESSIONID);
    var funcInfo = config.server.function;
    var j = request.jar();
    var cookie = request.cookie('JSESSIONID=' + JSESSIONID);
    j.setCookie(cookie, funcInfo.url);
    request({
        url: funcInfo.url,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        jar: j,
        method: 'POST',
        form: funcInfo.data
    }, function (err, httpResponse, body) {
        if (err) {
            return console.error('failed:', err);
        }
        if (!err && httpResponse.statusCode === 200) {
            body = JSON.parse(body);
            for (var i = 0, l = body.aaData.length; i < l; i++) {
                data[body.aaData[i].code.trim()] = body.aaData[i].id;
            }
            done();
        }
    });
});