const {build,data,port} = require('./util');
const plugins = require('gulp-load-plugins')();
const del = require('del')
const bs = require('browser-sync').create();
const {src,dest,series,parallel,watch} = require('gulp')

//构建任务
const baseTask  = {
    //脚本文件处理
    script() {
       return src(build.paths.scripts,{base: build.src,cwd: build.src})
                  .pipe(plugins.babel({presets:['@babel/preset-env']})) // 使用babel 处理 js代码
                  .pipe(dest(build.temp))// 编译后先放在临时目录中
    },
    // scss 文件处理
    style() {
        return src(build.paths.styles,{base: build.src,cwd: build.src})
        .pipe(plugins.sass({outputStyle:'expanded'})) // 将sass 转化成 css， 并设置展开格式
        .pipe(dest(build.temp))// 编译后先放在临时目录中
    },
    // 图片压缩
    image() {
        return src(build.paths.images,{base: build.src,cwd: build.src})
        .pipe(plugins.imagemin()) // 将图片进行无损压缩
        .pipe(dest(build.dist))// 存放在生产环境目录
    },
    page() {
        return src(build.paths.pages,{base: build.src,cwd: build.src})
        .pipe(plugins.swig({data: data,defaults: {cache: false}})) // 将图片进行无损压缩
        .pipe(dest(build.temp))// 存放在生产环境目录
        .pipe(bs.reload({ stream: true }));
    },
    // 对svg 进行压缩
    fonts() {
        return src(build.paths.fonts,{base: build.src,cwd: build.src})
        .pipe(plugins.imagemin()) // 将图片进行无损压缩
        .pipe(dest(build.dist))// 存放在生产环境目录
    },
    // 将静态资源复制到打包目录中
    extra () {
        return src("**", { base: build.public, cwd: build.public })
            .pipe(dest(build.dist))
    }
}

// 清除临时文件和生产环境文件
const cleanTask = () => {
   return del([build.temp,build.temp]) ;
}
// 将 页面中的 js 和 css 文件进行压缩，
const useref = () => {
    return src('**', { base: build.temp ,cwd: build.temp},)
    .pipe(plugins.useref({ searchPath: [build.temp, "."] })) // 从dist 和 根目录下 查找
    .pipe(plugins.if(/\.js$/, plugins.uglify()))
    .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
    .pipe(
      plugins.if(
        /\.html$/,
        plugins.htmlmin({
          collapseWhitespace: true, // 压缩换行
          minifyCSS: true, // 压缩行内的 css
          minifyJS: true // 压缩行内 js
        })
      )
    )
    .pipe(dest(build.dist),);
}
// 将 样式 、脚本、页面 进行构建
const compile = parallel(baseTask.style,baseTask.script,baseTask.page,baseTask.extra); 
// 启动服务,配置监听 和热更新
const serve = () => {
   // 监听 js、scss、html 的文件修改，并将其构建到临时目录中
   watch(build.paths.scripts,{ cwd:build.src },baseTask.script);
   watch(build.paths.styles,{ cwd: build.src },baseTask.style);
   watch(build.paths.pages,{ cwd: build.src },baseTask.page);
   // 监听 图片 字体，将其构建到生产目录中
   watch([build.paths.images,build.paths.fonts], { cwd: build.src },bs.reload)
   // 监听静态资源，将其构建到生产目录中
   watch(build.public, { cwd:build.src },baseTask.extra)
   bs.init({
       notify: false, //取消更新通知
       port: port,
       server: {
        baseDir: [build.temp, build.dist, build.public], // 指定服务启动的根目录
        routes: {
          "/node_modules": "node_modules" // 设置为相对路径
        }
      }
   })
}
// 以开发者模式启动项目，先编译文件，再启动服务
const devTask = series(compile,serve);
// 进行打包
const buildTask = series(cleanTask,parallel(series(compile,useref) ,baseTask.image,baseTask.fonts,baseTask.extra))
module.exports = {
    clean: cleanTask,dev: devTask,build: buildTask
}