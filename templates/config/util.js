// 配置文件的读取路径
const build = {
  src: 'src',
  temp: '.tmp',
  dist: 'release',
  public: 'public',
  paths: {
    styles: 'assets/styles/*.scss',
    scripts: 'assets/scripts/*.js',
    images: "assets/images/**",
    fonts: "assets/fonts/**",
    pages: "**/*.html"
  }
}
// 注入 html 的数据，插值表达式的上下文数据
const data = {
  
}


const port = 2000;
module.exports = {
  data,
  build,
  port
}
