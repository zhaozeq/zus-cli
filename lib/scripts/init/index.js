#! /usr/bin/env node
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _require = require('fs'),
    existsSync = _require.existsSync;

var _require2 = require('child_process'),
    exec = _require2.exec;

var inquirer = require('inquirer');

var rimraf = require('rimraf').sync;

var which = require('which');

var chalk = require('chalk');

var spin = require('ora');

var DATA = require('../../doc/interaction');

var cloneFinished = require('./cloneFinished');

var cwdPath = process.cwd(); //需要获得命令执行的位置

function errConsole(msg) {
  console.log(chalk.red(msg));
  process.exit(0);
}

function cloneProject(_ref) {
  var templateName = _ref.templateName,
      projectName = _ref.projectName;
  return new Promise(function (resolve) {
    var cwd = "".concat(cwdPath, "/").concat(projectName);

    if (which.sync('git', {
      nothrow: true
    })) {
      var loading = spin('clone start...');
      loading.start();
      exec("git clone https://github.com/zhaozeq/init_".concat(templateName, "_project.git ").concat(projectName), {
        cwd: cwdPath,
        timeout: 10000
      }, function (err) {
        if (err) {
          console.log("\n".concat(err));
          errConsole("\n ".concat(templateName, "\u6A21\u677F\u83B7\u53D6\u5931\u8D25"));
        } // 删除.git文件


        rimraf("".concat(cwd, "/.git"));
        console.log(chalk.green("\n  ".concat(templateName, " template project has cloned!")));
        loading.stop();
        resolve();
      });
    } else {
      errConsole('\n 检测到您未安装git,请安装后重试(地址：https://git-scm.com/downloads)');
    }
  });
}
/**
 * @param {array} argvs
 *  projectName: 项目名称
 *  type 模板类型
 */


function newProject(_x) {
  return _newProject.apply(this, arguments);
}

function _newProject() {
  _newProject = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_ref2) {
    var _ref4, projectName, templateName;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _ref4 = (0, _slicedToArray2["default"])(_ref2, 2), projectName = _ref4[0], templateName = _ref4[1];
            _context2.next = 3;
            return cloneProject({
              templateName: templateName,
              projectName: projectName
            });

          case 3:
            cloneFinished(projectName);

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _newProject.apply(this, arguments);
}

module.exports = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(projectName) {
    var answers;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (existsSync(projectName)) {
              errConsole(" \u5F53\u524D\u76EE\u5F55\u5DF2\u5B58\u5728\u540D\u4E3A".concat(projectName, "\u7684\u6587\u4EF6\u5939,\u8BF7\u5904\u7406"));
            }
            /* 询问模板类型 */


            _context.next = 3;
            return inquirer.prompt(DATA.TEMPCHOICE);

          case 3:
            answers = _context.sent;

            /* 创建项目 */
            newProject([projectName, answers.template]);

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x2) {
    return _ref3.apply(this, arguments);
  };
}();