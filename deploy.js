const client = require('scp2');
// 控制台美化所用
const ora = require('ora');
const chalk = require('chalk');
const readline = require('readline'); // 应替换第三方模块-prompt

const spinner = ora(chalk.green('正在发布到服务器...'));

const password = async (argvs) => {

  if (!argvs.length) {
    return false
  }

  const aIndex = argvs.findIndex((it) => it === '-p')
  if (aIndex > -1) {
    return argvs[aIndex + 1]?.trim()
  }
  const bIndex = argvs.findIndex((it) => it.startsWith('-p'))
  if (bIndex > -1) {
    return argvs[bIndex].slice(2)?.tirm()
  }
  return false
  
}


async function deploy(from, to) {
  const pwd = await checkPwd()
  if (pwd) {
    spinner.start();
    client.scp(from, {    // 本地打包文件的位置
      "host": '111.229.117.16', // 服务器的IP地址
      "port": '22',            // 服务器端口， 一般为 22
      "username": 'root',       // 用户名
      "password": pwd,     // 密码
      "path": to            // 项目部署的服务器目标位置
    }, err => {
      spinner.stop();
      if (!err) {
        console.log(chalk.green("项目发布完毕!"))
      } else {
        console.log("err", err)
      }
    })
  }

  
}

async function checkPwd() {

  const pwd = await password(process.argv.slice(2));

  if (pwd === false) {
    console.log('Please input password!')
    return pwd
  }
  return new Promise((resolve, reject) => {
    if (!pwd) {
      const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
      });
    
      rl.setPrompt('input> ');
      rl.prompt();
    
      rl.on('line', (line) => {
        if(line.trim() === 'close') {
          return rl.close()
        }
        resolve(line)
        rl.prompt();
      })
      rl.on('close', () => {
        process.exit(0)
      })
    } else {
      resolve(pwd)
    }
    
  })
  
}


deploy('./build/', '/home/program/pkgame/public')