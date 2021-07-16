module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    proxy: {
      '/api': {
        target: 'http://60.249.120.228/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          "^/api": ""	//萬用字元
        }
      },
    }
  },
  publicPath:'./'
}
