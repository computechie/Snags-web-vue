
const { defineConfig } = require('@vue/cli-service');

process.env.VUE_APP_VERSION = require('./package.json').version;

module.exports = defineConfig({
  transpileDependencies: true,
  //lintOnSave:false,
  // publicPath: '/vue'   // <-- add subdir if distribution is not in root folder /

  
  
})






