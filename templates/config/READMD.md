## 简介
使用gulp完成项目的自动化构建
配置 gulp ，
- 将项目中的 scss 转化成 css 
- 高版本的 es语法转化成es5 语法 
- 将数据替换到html插值表达式中
- 压缩项目代码 和 图片(包含对fonts的处理)
- 启动一个服务，实时监视文件的修改，同步到浏览器中

主要实现：
- clean 任务，负责清除项目中缓存文件 和 打包后的文件
- dev 任务，负责启动项目，让项目运行在一个服务中，实时监视开发文件的修改，并实时同步到浏览器当中
- build 任务，负责构建项目，将项目文件进行打包，打包后的文件相比开发中体积较小，能兼容大多数浏览器。

## 实现步骤

#### 安装依赖，创建配置文件
安装所需的插件
- gulp `yarn add gulp --dev`
- babel `yarn add gulp-babel  @babel/core  @babel/preset-env --dev` 对es 进行降级
- sass `yarn add gulp-sass sass --dev` 将scss 转化成 css
- gulp-swig `yarn add gulp-swig --dev` 模板引擎，将html中插值表达式替换成数据
- browser-sync `yarn add browser-sync --dev`热更新
- del `yarn add del --dev` 删除文件
- gulp-clean-css `yarn add gulp-clean-css --dev` 压缩css
- gulp-htmlmin `yarn add gulp-htmlmin --dev` 压缩 html
- gulp-uglify `yarn add gulp-uglify --dev` 压缩js
- gulp-imagemin `yarn add gulp-imagemin --dev` 压缩图片  
- gulp-if `yarn add gulp-if --dev`
- gulp-load-plugins `yarn add gulp-load-plugins --dev` 一次性加载 项目中所有的 gulp插件
- gulp-useref `yarn add gulp-useref --dev`

#### 配置构建任务
使用对应的插件 ，对scss 、js、html 图片等进行构建，并使用 `gulp-useref` 插件对项目中的 js\css\html 文件进行压缩

#### 配置监视 、 热更新任务
使用`gulp`中的 watch 进行监视，`browser-sync` 插件启动服务 和 热更新

#### 配置清除任务
使用 `del` 插件将临时目录和生产环境目录下的文件全部清空。

#### 配置组合任务
- dev 任务，先将 样式 、脚本 和 页面进行构建，并存放在 临时目录中，然后再启动服务 进行监视 热更新。
- build 任务，先清除所有的临时文件 和生产环境下文件，然后将样式、脚本、页面 构建后 进行压缩，并同时构建静态资源、图片、字体。

#### 在 package.json 中配置快捷命令
package.json
```json
    "scripts": {
        "clean": "gulp clean",
        "dev": "gulp dev",
        "build": "gulp build"
    },
```

## 运行
- 清除临时目录 和 生产目录文件: `yarn clean`
- 启动项目: `yarn dev`
- 打包: `yarn build`