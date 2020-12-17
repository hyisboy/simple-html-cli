
## 简介
一个应用于简单前端项目的cli工具，将 html、scss、js 、图片进行处理， 以及基本的 开发构建流。

可以在项目中使用 scss,高级的es语法，修改文件立即更新等功能。 使用之前需要先查看目录结构哦，请严格按照目录结构开发~~


#### 使用

```shell
 # 1. 先将 cli 工具安装到全局
 yarn add simple-html-cli -g --dev
 # 2. 创建项目 
 simple-html-cli 
 ...输入项目名， 就会生成一个项目
 # 3. 进入生成的项目
 cd myProject
 # 4. 安装依赖
 yarn 

```

- 将项目中的 scss 转化成 css 
- 高版本的 es语法转化成es5 语法 
- 将数据替换到html插值表达式中
- 压缩项目代码 和 图片(包含对fonts的处理)
- 启动一个服务，实时监视文件的修改，同步到浏览器中

## 目录结构
```
|__ .tmp          缓存文件
|__ config        gulp 的配置文件
|__ public        存放一些不希望打包的文件，打包时会直接将public下的文件直接复制到根目录
|__ release       存放打包后的文件
|__ src
   |__ assets     
      |__ fonts   字体文件
      |__ images  图片
      |__ scripts js
      |__ styles  样式文件，可以是 scss 或 css
   |__ pages      存放页面，html文件
```

## 工作流
- clean 任务，负责清除项目中缓存文件 和 打包后的文件
- dev 任务，负责启动项目，让项目运行在一个服务中，实时监视开发文件的修改，并实时同步到浏览器当中
- build 任务，负责构建项目，将项目文件进行打包，打包后的文件相比开发中体积较小，能兼容大多数浏览器。

```shell
   # 清除生产环境下的打包文件
   yarn clean
   # 开发任务
   yarn dev
   # 打包任务
   yarn build
```