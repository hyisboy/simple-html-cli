#!/usr/bin/env node

const path = require('path');
const inquirer = require('inquirer')
const ejs = require('ejs');
const fs = require('fs');
const del = require('del')
const joinPath = (name) => {
   return path.join(__dirname, name);
}
const cwd = process.cwd();

// 设置选项
inquirer.prompt([{
   name: 'projectName',
   message: "project name",
   default: 'myProject',
   type: 'input'
}]).then(answer => {
   const tempDir = joinPath('templates');
   const projectDir = path.join(cwd, answer.projectName);
   const stat = exitDirectory(projectDir)
   // 如果项目已经存在，则需要验证是否进行覆盖
   if(stat){
      inquirer.prompt([
         {
            name:'cover',
            message:`${answer.projectName}已存在，是否覆盖？yes/no`,
            default:'no',
            type:'input'
         }
      ]).then(async (res) => {
          if(res.cover =='yes'){
            await clean(projectDir)
            handleTask(tempDir,projectDir,answer);
          }
      })
      return 
   }
   handleTask(tempDir,projectDir,answer);
   console.log('1. cd'+' '+answer.name);
   console.log('2. yarn')
   
})
// 开始任务
function handleTask(tempDir,projectDir,answer) {
   let filePaths = []
   filePaths = getFilePath(tempDir,filePaths, undefined ,projectDir)
   compile(filePaths,tempDir,projectDir,answer)
}
// 清除所有的内容
function clean(_path) {
   return del([_path])
}
/**
 * 判断目录是否已存在
 * @param {*} dirPath 
 */
function exitDirectory(dirPath) {
   try{
      const stat = fs.statSync(dirPath)
      return stat;
   }catch(e){
      return null;
   }
}
// 获取模板下的路径，并创建上级目录
function getFilePath(dir,paths = [],relDir,absDir) {
    fs.mkdirSync(absDir);
    let files  = fs.readdirSync(dir,{withFileTypes: true})
     files.forEach(file => {
      if (file.isDirectory()) {
         getFilePath(path.join(dir,file.name),paths,relDir ? relDir+'/'+file.name : file.name, path.join(absDir,file.name));
      } else {
         let __path = relDir? relDir+'/'+file.name : file.name;
         paths.push(__path)
      }
    })
   return paths;
}
// 生成文件,当为 html文件时，使用ejs进行模板渲染
function compile(paths,dir, toDir,answer) {
   paths.forEach(file => {
      if(file.endsWith('.html')){
        ejs.renderFile(path.join(dir,file), answer, (err, result) => {
         if (err) {
            return
         }
         fs.writeFileSync(path.join(toDir,file),result)
      })
      }else {
         fs.writeFileSync(path.join(toDir,file),fs.readFileSync(path.join(dir,file)))
      }
   })
}