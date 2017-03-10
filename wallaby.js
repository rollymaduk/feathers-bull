/**
 * Created by ronald on 3/10/17.
 */

module.exports = function (wallaby) {
  return {

    files: [
      {pattern: 'src/**/*.js', load: false},
      {pattern: 'lib/**/*.js', load: false}
    ],


    tests: [
      {pattern: 'test/**/*test.js', load: true}
    ],
    compilers: {
      '**/*.js': wallaby.compilers.babel()
    },

    workers:{
      recycle:true
    },

    env:{
      type:"node"
    },

    testFramework:"mocha"

  };
};

