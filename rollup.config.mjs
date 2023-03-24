import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import serve from 'rollup-plugin-serve'
import terser from '@rollup/plugin-terser';
// import json from '@rollup/plugin-json';
//const pkg = require("./package.json");
//import pkg from './package.json' assert { type: 'json' }; 
import pkg from './load-package.cjs'
const production = !process.env.ROLLUP_WATCH;
export default {
  input: ['index.js'],
  output: [{
    name: 'transform',
    file: "dist/coord-transform.cjs",
    format: 'cjs',
    sourcemap: !production,
    banner:
      "/*!\nname: " +  //开头添加 ! 能够阻止terser压缩时抽取注释
      pkg.name +
      "\nversion:v" +
      pkg.version +
      "\nauthor:" +
      pkg.author +
      "\n" +
      new Date() +
      "\n */",
  },
  {
    name: 'transform',
    file: "dist/coord-transform.mjs",
    format: 'esm',
    sourcemap: !production,
    banner:
      "/*!\nname: " +  //开头添加 ! 能够阻止terser压缩时抽取注释
      pkg.name +
      "\nversion:v" +
      pkg.version +
      "\nauthor:" +
      pkg.author +
      "\n" +
      new Date() +
      "\n */",
  },
  {
    name: 'transform',
    file: "dist/coord-transform.js",
    format: 'umd',
    sourcemap: !production,
    banner:
      "/*!\nname: " +  //开头添加 ! 能够阻止terser压缩时抽取注释
      pkg.name +
      "\nversion:v" +
      pkg.version +
      "\nauthor:" +
      pkg.author +
      "\n" +
      new Date() +
      "\n */",
  },
],
  treeshake: true,
  plugins: [
    // json(),
    resolve(),
    commonjs(),
    babel({ babelHelpers: 'bundled' }),
    production && terser(), //生产环境压缩
    !production && serve({   //开发环境打开示例
      open:true,
      openPage:'/public/index.html',
      contentBase: '',
    })
  ],
};