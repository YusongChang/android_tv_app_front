module.exports = {
  // presets: [
  //   '@vue/cli-plugin-babel/preset'
  // ]
  presets: [
    [
      '@vue/app', {
        useBuiltIns: 'entry',
        polyfills: [
          'es6.promise',
          'es6.symbol'
        ]
      }
    ]
  ]
}
