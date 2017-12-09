/**
 * Created by umin.
 * 默认配置文件，webpack.config.js
 * 执行，webpack自动找 webpack.config.js 内容进行相关内容的打包操作
 */
'use strict';
var HtmlwebpackPlugin = require('html-webpack-plugin');

module.exports = {

    //入口文件配置
    entry: {
        // webpack 要打包的源文件
        'app1': './src/babel/webpack/main.js',
        'app2': './src/babel/module1/main.js'
    },

    //导出文件配置
    output:{
        path: __dirname +'/build/',
        // 打包后输出的文件名称, ./build.js 表示输出到当前目录下
        filename: '[name]/bundle.js',
        publicPath: '/'
    },

    module: {
        // rules 也可以使用 rules 代替 loaders
        loaders: [
            // 处理 css，自动添加浏览器前缀
            {
                // 所有 .css 结尾的文件都被此loader 处理
                test: /\.css$/,
                // 如果写成 style!css 或者 css-loader!style-loader 都会报错
                loader: 'style-loader!css-loader!autoprefixer-loader'
            },
            // 处理 less
            {
                // 所有 .less 结尾的文件都被此loader 处理
                test: /\.less$/,
                loader:'style-loader!css-loader!autoprefixer-loader!less-loader'
            },
            // 处理图片
            {
                // 匹配文件的后缀名是 .png 或者 .jpg
                test: /\.(png|jpg|ttf)$/,
                // url就是url-loader的缩写，表示图片大小小于20000，
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: 'asserts/img/[name].[hash:7].[ext]'
                }
                // 就将这张图片编译成base64的字符串使用，否则就把图片打包编译到文件夹中
                // 这里注意 限制的 值不能太大，太大会导致build.js 文件过大，影响性能
            },
            // 处理 js es6 转 es5
            {
                test: /\.js$/,
                // 排除目录
                exclude: /node_modules/,
                include: /src/,
                // 自动转码
                loader: 'babel-loader'
            }
        ]
    },

    plugins: [
        new HtmlwebpackPlugin({
            //生成页面
            filename: 'app1/index.html',
            //模板页面
            template: './index.html',
            chunks: ['app1'],
            inject: true,
            minify:{
                removeComments:false,
                collapseWhitespace:false
            }
        }),
        new HtmlwebpackPlugin({
            //生成页面
            filename: 'app2/index.html',
            //模板页面
            template: './index.html',
            chunks: ['app2'],
            inject: true,
            minify:{
                removeComments:false,
                collapseWhitespace:false
            }
        })
    ]
};
