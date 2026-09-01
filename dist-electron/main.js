import { app, ipcMain, BrowserWindow } from "electron";
import { fileURLToPath } from "node:url";
import path$1 from "node:path";
import require$$0 from "fs";
import require$$1 from "path";
import require$$2 from "util";
import fs$1 from "node:fs";
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var lib = { exports: {} };
var util$1 = {};
util$1.getBooleanOption = (options, key) => {
  let value = false;
  if (key in options && typeof (value = options[key]) !== "boolean") {
    throw new TypeError(`Expected the "${key}" option to be a boolean`);
  }
  return value;
};
util$1.cppdb = Symbol();
util$1.inspect = Symbol.for("nodejs.util.inspect.custom");
let SqliteError$1 = class SqliteError extends Error {
  constructor(message, code) {
    if (typeof code !== "string") {
      throw new TypeError("Expected second argument to be a string");
    }
    super("" + message);
    this.code = code;
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, SqliteError);
    }
  }
};
Object.defineProperty(SqliteError$1.prototype, "name", {
  value: "SqliteError",
  writable: true,
  enumerable: false,
  configurable: true
});
var sqliteError = SqliteError$1;
var wrappers = {};
var hasRequiredWrappers;
function requireWrappers() {
  if (hasRequiredWrappers) return wrappers;
  hasRequiredWrappers = 1;
  const { cppdb } = util$1;
  wrappers.prepare = function prepare(sql) {
    return this[cppdb].prepare(sql, this, false, false);
  };
  wrappers.exec = function exec(sql) {
    this[cppdb].exec(sql);
    return this;
  };
  wrappers.close = function close() {
    this[cppdb].close();
    return this;
  };
  wrappers.loadExtension = function loadExtension(...args) {
    this[cppdb].loadExtension(...args);
    return this;
  };
  wrappers.defaultSafeIntegers = function defaultSafeIntegers(...args) {
    this[cppdb].defaultSafeIntegers(...args);
    return this;
  };
  wrappers.unsafeMode = function unsafeMode(...args) {
    this[cppdb].unsafeMode(...args);
    return this;
  };
  wrappers.getters = {
    name: {
      get: function name() {
        return this[cppdb].name;
      },
      enumerable: true
    },
    open: {
      get: function open() {
        return this[cppdb].open;
      },
      enumerable: true
    },
    inTransaction: {
      get: function inTransaction() {
        return this[cppdb].inTransaction;
      },
      enumerable: true
    },
    readonly: {
      get: function readonly() {
        return this[cppdb].readonly;
      },
      enumerable: true
    },
    memory: {
      get: function memory() {
        return this[cppdb].memory;
      },
      enumerable: true
    }
  };
  return wrappers;
}
var transaction;
var hasRequiredTransaction;
function requireTransaction() {
  if (hasRequiredTransaction) return transaction;
  hasRequiredTransaction = 1;
  const { cppdb } = util$1;
  const controllers = /* @__PURE__ */ new WeakMap();
  transaction = function transaction2(fn) {
    if (typeof fn !== "function") throw new TypeError("Expected first argument to be a function");
    const db2 = this[cppdb];
    const controller = getController(db2, this);
    const { apply } = Function.prototype;
    const properties = {
      default: { value: wrapTransaction(apply, fn, db2, controller.default) },
      deferred: { value: wrapTransaction(apply, fn, db2, controller.deferred) },
      immediate: { value: wrapTransaction(apply, fn, db2, controller.immediate) },
      exclusive: { value: wrapTransaction(apply, fn, db2, controller.exclusive) },
      database: { value: this, enumerable: true }
    };
    Object.defineProperties(properties.default.value, properties);
    Object.defineProperties(properties.deferred.value, properties);
    Object.defineProperties(properties.immediate.value, properties);
    Object.defineProperties(properties.exclusive.value, properties);
    return properties.default.value;
  };
  const getController = (db2, self) => {
    let controller = controllers.get(db2);
    if (!controller) {
      const shared = {
        commit: db2.prepare("COMMIT", self, false, false),
        rollback: db2.prepare("ROLLBACK", self, false, false),
        savepoint: db2.prepare("SAVEPOINT `	_bs3.	`", self, false, false),
        release: db2.prepare("RELEASE `	_bs3.	`", self, false, false),
        rollbackTo: db2.prepare("ROLLBACK TO `	_bs3.	`", self, false, false)
      };
      controllers.set(db2, controller = {
        default: Object.assign({ begin: db2.prepare("BEGIN", self, false, false) }, shared),
        deferred: Object.assign({ begin: db2.prepare("BEGIN DEFERRED", self, false, false) }, shared),
        immediate: Object.assign({ begin: db2.prepare("BEGIN IMMEDIATE", self, false, false) }, shared),
        exclusive: Object.assign({ begin: db2.prepare("BEGIN EXCLUSIVE", self, false, false) }, shared)
      });
    }
    return controller;
  };
  const wrapTransaction = (apply, fn, db2, { begin, commit, rollback, savepoint, release, rollbackTo }) => function sqliteTransaction() {
    let before, after, undo;
    if (db2.inTransaction) {
      before = savepoint;
      after = release;
      undo = rollbackTo;
    } else {
      before = begin;
      after = commit;
      undo = rollback;
    }
    before.run();
    try {
      const result = apply.call(fn, this, arguments);
      if (result && typeof result.then === "function") {
        throw new TypeError("Transaction function cannot return a promise");
      }
      after.run();
      return result;
    } catch (ex) {
      if (db2.inTransaction) {
        undo.run();
        if (undo !== rollback) after.run();
      }
      throw ex;
    }
  };
  return transaction;
}
var pragma;
var hasRequiredPragma;
function requirePragma() {
  if (hasRequiredPragma) return pragma;
  hasRequiredPragma = 1;
  const { getBooleanOption, cppdb } = util$1;
  pragma = function pragma2(source, options) {
    if (options == null) options = {};
    if (typeof source !== "string") throw new TypeError("Expected first argument to be a string");
    if (typeof options !== "object") throw new TypeError("Expected second argument to be an options object");
    const simple = getBooleanOption(options, "simple");
    const stmt = this[cppdb].prepare(`PRAGMA ${source}`, this, true, false);
    return simple ? stmt.pluck().get() : stmt.all();
  };
  return pragma;
}
var explain;
var hasRequiredExplain;
function requireExplain() {
  if (hasRequiredExplain) return explain;
  hasRequiredExplain = 1;
  const { cppdb } = util$1;
  explain = function explain2(source) {
    if (typeof source !== "string") throw new TypeError("Expected first argument to be a string");
    const stmt = this[cppdb].prepare(`EXPLAIN ${source}`, this, false, true);
    return stmt.all();
  };
  return explain;
}
var backup;
var hasRequiredBackup;
function requireBackup() {
  if (hasRequiredBackup) return backup;
  hasRequiredBackup = 1;
  const fs2 = require$$0;
  const path2 = require$$1;
  const { promisify } = require$$2;
  const { cppdb } = util$1;
  const fsAccess = promisify(fs2.access);
  backup = async function backup2(filename, options) {
    if (options == null) options = {};
    if (typeof filename !== "string") throw new TypeError("Expected first argument to be a string");
    if (typeof options !== "object") throw new TypeError("Expected second argument to be an options object");
    filename = filename.trim();
    const attachedName = "attached" in options ? options.attached : "main";
    const handler = "progress" in options ? options.progress : null;
    if (!filename) throw new TypeError("Backup filename cannot be an empty string");
    if (filename === ":memory:") throw new TypeError('Invalid backup filename ":memory:"');
    if (typeof attachedName !== "string") throw new TypeError('Expected the "attached" option to be a string');
    if (!attachedName) throw new TypeError('The "attached" option cannot be an empty string');
    if (handler != null && typeof handler !== "function") throw new TypeError('Expected the "progress" option to be a function');
    await fsAccess(path2.dirname(filename)).catch(() => {
      throw new TypeError("Cannot save backup because the directory does not exist");
    });
    const isNewFile = await fsAccess(filename).then(() => false, () => true);
    return runBackup(this[cppdb].backup(this, attachedName, filename, isNewFile), handler || null);
  };
  const runBackup = (backup2, handler) => {
    let rate = 0;
    let useDefault = true;
    return new Promise((resolve, reject) => {
      setImmediate(function step() {
        try {
          const progress = backup2.transfer(rate);
          if (!progress.remainingPages) {
            backup2.close();
            resolve(progress);
            return;
          }
          if (useDefault) {
            useDefault = false;
            rate = 100;
          }
          if (handler) {
            const ret = handler(progress);
            if (ret !== void 0) {
              if (typeof ret === "number" && ret === ret) rate = Math.max(0, Math.min(2147483647, Math.round(ret)));
              else throw new TypeError("Expected progress callback to return a number or undefined");
            }
          }
          setImmediate(step);
        } catch (err) {
          backup2.close();
          reject(err);
        }
      });
    });
  };
  return backup;
}
var serialize;
var hasRequiredSerialize;
function requireSerialize() {
  if (hasRequiredSerialize) return serialize;
  hasRequiredSerialize = 1;
  const { cppdb } = util$1;
  serialize = function serialize2(options) {
    if (options == null) options = {};
    if (typeof options !== "object") throw new TypeError("Expected first argument to be an options object");
    const attachedName = "attached" in options ? options.attached : "main";
    if (typeof attachedName !== "string") throw new TypeError('Expected the "attached" option to be a string');
    if (!attachedName) throw new TypeError('The "attached" option cannot be an empty string');
    return this[cppdb].serialize(attachedName);
  };
  return serialize;
}
var _function;
var hasRequired_function;
function require_function() {
  if (hasRequired_function) return _function;
  hasRequired_function = 1;
  const { getBooleanOption, cppdb } = util$1;
  _function = function defineFunction(name, options, fn) {
    if (options == null) options = {};
    if (typeof options === "function") {
      fn = options;
      options = {};
    }
    if (typeof name !== "string") throw new TypeError("Expected first argument to be a string");
    if (typeof fn !== "function") throw new TypeError("Expected last argument to be a function");
    if (typeof options !== "object") throw new TypeError("Expected second argument to be an options object");
    if (!name) throw new TypeError("User-defined function name cannot be an empty string");
    const safeIntegers = "safeIntegers" in options ? +getBooleanOption(options, "safeIntegers") : 2;
    const deterministic = getBooleanOption(options, "deterministic");
    const directOnly = getBooleanOption(options, "directOnly");
    const varargs = getBooleanOption(options, "varargs");
    let argCount = -1;
    if (!varargs) {
      argCount = fn.length;
      if (!Number.isInteger(argCount) || argCount < 0) throw new TypeError("Expected function.length to be a positive integer");
      if (argCount > 100) throw new RangeError("User-defined functions cannot have more than 100 arguments");
    }
    this[cppdb].function(fn, name, argCount, safeIntegers, deterministic, directOnly);
    return this;
  };
  return _function;
}
var aggregate;
var hasRequiredAggregate;
function requireAggregate() {
  if (hasRequiredAggregate) return aggregate;
  hasRequiredAggregate = 1;
  const { getBooleanOption, cppdb } = util$1;
  aggregate = function defineAggregate(name, options) {
    if (typeof name !== "string") throw new TypeError("Expected first argument to be a string");
    if (typeof options !== "object" || options === null) throw new TypeError("Expected second argument to be an options object");
    if (!name) throw new TypeError("User-defined function name cannot be an empty string");
    const start = "start" in options ? options.start : null;
    const step = getFunctionOption(options, "step", true);
    const inverse = getFunctionOption(options, "inverse", false);
    const result = getFunctionOption(options, "result", false);
    const safeIntegers = "safeIntegers" in options ? +getBooleanOption(options, "safeIntegers") : 2;
    const deterministic = getBooleanOption(options, "deterministic");
    const directOnly = getBooleanOption(options, "directOnly");
    const varargs = getBooleanOption(options, "varargs");
    let argCount = -1;
    if (!varargs) {
      argCount = Math.max(getLength(step), inverse ? getLength(inverse) : 0);
      if (argCount > 0) argCount -= 1;
      if (argCount > 100) throw new RangeError("User-defined functions cannot have more than 100 arguments");
    }
    this[cppdb].aggregate(start, step, inverse, result, name, argCount, safeIntegers, deterministic, directOnly);
    return this;
  };
  const getFunctionOption = (options, key, required) => {
    const value = key in options ? options[key] : null;
    if (typeof value === "function") return value;
    if (value != null) throw new TypeError(`Expected the "${key}" option to be a function`);
    if (required) throw new TypeError(`Missing required option "${key}"`);
    return null;
  };
  const getLength = ({ length }) => {
    if (Number.isInteger(length) && length >= 0) return length;
    throw new TypeError("Expected function.length to be a positive integer");
  };
  return aggregate;
}
var table;
var hasRequiredTable;
function requireTable() {
  if (hasRequiredTable) return table;
  hasRequiredTable = 1;
  const { cppdb } = util$1;
  table = function defineTable(name, factory) {
    if (typeof name !== "string") throw new TypeError("Expected first argument to be a string");
    if (!name) throw new TypeError("Virtual table module name cannot be an empty string");
    let eponymous = false;
    if (typeof factory === "object" && factory !== null) {
      eponymous = true;
      factory = defer(parseTableDefinition(factory, "used", name));
    } else {
      if (typeof factory !== "function") throw new TypeError("Expected second argument to be a function or a table definition object");
      factory = wrapFactory(factory);
    }
    this[cppdb].table(factory, name, eponymous);
    return this;
  };
  function wrapFactory(factory) {
    return function virtualTableFactory(moduleName, databaseName, tableName, ...args) {
      const thisObject = {
        module: moduleName,
        database: databaseName,
        table: tableName
      };
      const def = apply.call(factory, thisObject, args);
      if (typeof def !== "object" || def === null) {
        throw new TypeError(`Virtual table module "${moduleName}" did not return a table definition object`);
      }
      return parseTableDefinition(def, "returned", moduleName);
    };
  }
  function parseTableDefinition(def, verb, moduleName) {
    if (!hasOwnProperty.call(def, "rows")) {
      throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition without a "rows" property`);
    }
    if (!hasOwnProperty.call(def, "columns")) {
      throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition without a "columns" property`);
    }
    const rows = def.rows;
    if (typeof rows !== "function" || Object.getPrototypeOf(rows) !== GeneratorFunctionPrototype) {
      throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with an invalid "rows" property (should be a generator function)`);
    }
    let columns = def.columns;
    if (!Array.isArray(columns) || !isStringArray(columns = [...columns])) {
      throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with an invalid "columns" property (should be an array of strings)`);
    }
    if (columns.length !== new Set(columns).size) {
      throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with duplicate column names`);
    }
    if (!columns.length) {
      throw new RangeError(`Virtual table module "${moduleName}" ${verb} a table definition with zero columns`);
    }
    let parameters;
    if (hasOwnProperty.call(def, "parameters")) {
      parameters = def.parameters;
      if (!Array.isArray(parameters) || !isStringArray(parameters = [...parameters])) {
        throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with an invalid "parameters" property (should be an array of strings)`);
      }
    } else {
      parameters = inferParameters(rows);
    }
    if (parameters.length !== new Set(parameters).size) {
      throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with duplicate parameter names`);
    }
    if (parameters.length > 32) {
      throw new RangeError(`Virtual table module "${moduleName}" ${verb} a table definition with more than the maximum number of 32 parameters`);
    }
    for (const parameter of parameters) {
      if (columns.includes(parameter)) {
        throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with column "${parameter}" which was ambiguously defined as both a column and parameter`);
      }
    }
    let safeIntegers = 2;
    if (hasOwnProperty.call(def, "safeIntegers")) {
      const bool = def.safeIntegers;
      if (typeof bool !== "boolean") {
        throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with an invalid "safeIntegers" property (should be a boolean)`);
      }
      safeIntegers = +bool;
    }
    let directOnly = false;
    if (hasOwnProperty.call(def, "directOnly")) {
      directOnly = def.directOnly;
      if (typeof directOnly !== "boolean") {
        throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with an invalid "directOnly" property (should be a boolean)`);
      }
    }
    const columnDefinitions = [
      ...parameters.map(identifier).map((str) => `${str} HIDDEN`),
      ...columns.map(identifier)
    ];
    return [
      `CREATE TABLE x(${columnDefinitions.join(", ")});`,
      wrapGenerator(rows, new Map(columns.map((x, i) => [x, parameters.length + i])), moduleName),
      parameters,
      safeIntegers,
      directOnly
    ];
  }
  function wrapGenerator(generator, columnMap, moduleName) {
    return function* virtualTable(...args) {
      const output = args.map((x) => Buffer.isBuffer(x) ? Buffer.from(x) : x);
      for (let i = 0; i < columnMap.size; ++i) {
        output.push(null);
      }
      for (const row of generator(...args)) {
        if (Array.isArray(row)) {
          extractRowArray(row, output, columnMap.size, moduleName);
          yield output;
        } else if (typeof row === "object" && row !== null) {
          extractRowObject(row, output, columnMap, moduleName);
          yield output;
        } else {
          throw new TypeError(`Virtual table module "${moduleName}" yielded something that isn't a valid row object`);
        }
      }
    };
  }
  function extractRowArray(row, output, columnCount, moduleName) {
    if (row.length !== columnCount) {
      throw new TypeError(`Virtual table module "${moduleName}" yielded a row with an incorrect number of columns`);
    }
    const offset = output.length - columnCount;
    for (let i = 0; i < columnCount; ++i) {
      output[i + offset] = row[i];
    }
  }
  function extractRowObject(row, output, columnMap, moduleName) {
    let count = 0;
    for (const key of Object.keys(row)) {
      const index = columnMap.get(key);
      if (index === void 0) {
        throw new TypeError(`Virtual table module "${moduleName}" yielded a row with an undeclared column "${key}"`);
      }
      output[index] = row[key];
      count += 1;
    }
    if (count !== columnMap.size) {
      throw new TypeError(`Virtual table module "${moduleName}" yielded a row with missing columns`);
    }
  }
  function inferParameters({ length }) {
    if (!Number.isInteger(length) || length < 0) {
      throw new TypeError("Expected function.length to be a positive integer");
    }
    const params = [];
    for (let i = 0; i < length; ++i) {
      params.push(`$${i + 1}`);
    }
    return params;
  }
  const { hasOwnProperty } = Object.prototype;
  const { apply } = Function.prototype;
  const GeneratorFunctionPrototype = Object.getPrototypeOf(function* () {
  });
  const identifier = (str) => `"${str.replace(/"/g, '""')}"`;
  const defer = (x) => () => x;
  const isStringArray = (arr) => {
    for (let i = 0; i < arr.length; ++i) {
      if (typeof arr[i] !== "string") return false;
    }
    return true;
  };
  return table;
}
var inspect;
var hasRequiredInspect;
function requireInspect() {
  if (hasRequiredInspect) return inspect;
  hasRequiredInspect = 1;
  const DatabaseInspection = function Database2() {
  };
  inspect = function inspect2(depth, opts) {
    return Object.assign(new DatabaseInspection(), this);
  };
  return inspect;
}
const fs = require$$0;
const path = require$$1;
const util = util$1;
const SqliteError2 = sqliteError;
var database = function createDatabase(getAddon, allowNativeBinding) {
  function Database2(filenameGiven, options) {
    if (new.target == null) {
      return new Database2(filenameGiven, options);
    }
    let buffer;
    if (Buffer.isBuffer(filenameGiven)) {
      buffer = filenameGiven;
      filenameGiven = ":memory:";
    }
    if (filenameGiven == null) filenameGiven = "";
    if (options == null) options = {};
    if (typeof filenameGiven !== "string") throw new TypeError("Expected first argument to be a string");
    if (typeof options !== "object") throw new TypeError("Expected second argument to be an options object");
    if ("readOnly" in options) throw new TypeError('Misspelled option "readOnly" should be "readonly"');
    if ("memory" in options) throw new TypeError('Option "memory" was removed in v7.0.0 (use ":memory:" filename instead)');
    const filename = filenameGiven.trim();
    const anonymous = filename === "" || filename === ":memory:";
    const readonly = util.getBooleanOption(options, "readonly");
    const fileMustExist = util.getBooleanOption(options, "fileMustExist");
    const timeout = "timeout" in options ? options.timeout : 5e3;
    const verbose = "verbose" in options ? options.verbose : null;
    const nativeBinding = "nativeBinding" in options ? options.nativeBinding : null;
    if (readonly && anonymous && !buffer) throw new TypeError("In-memory/temporary databases cannot be readonly");
    if (!Number.isInteger(timeout) || timeout < 0) throw new TypeError('Expected the "timeout" option to be a positive integer');
    if (timeout > 2147483647) throw new RangeError('Option "timeout" cannot be greater than 2147483647');
    if (verbose != null && typeof verbose !== "function") throw new TypeError('Expected the "verbose" option to be a function');
    if (!allowNativeBinding && "nativeBinding" in options) throw new TypeError('The "nativeBinding" option is only supported by the default better-sqlite3 entrypoint');
    if (allowNativeBinding && nativeBinding != null && typeof nativeBinding !== "string" && typeof nativeBinding !== "object") throw new TypeError('Expected the "nativeBinding" option to be a string or addon object');
    const addon = getAddon(nativeBinding);
    if (!addon.isInitialized) {
      addon.initialize(SqliteError2, arrayFactory, arrayAppender, rowFactory, recordFactory);
      addon.isInitialized = true;
    }
    if (!anonymous && !filename.startsWith("file:") && !fs.existsSync(path.dirname(filename))) {
      throw new TypeError("Cannot open database because the directory does not exist");
    }
    Object.defineProperties(this, {
      [util.cppdb]: { value: new addon.Database(filename, filenameGiven, anonymous, readonly, fileMustExist, timeout, verbose || null, buffer || null) },
      ...wrappers2.getters
    });
  }
  const wrappers2 = requireWrappers();
  Database2.prototype.prepare = wrappers2.prepare;
  Database2.prototype.transaction = requireTransaction();
  Database2.prototype.pragma = requirePragma();
  Database2.prototype.explain = requireExplain();
  Database2.prototype.backup = requireBackup();
  Database2.prototype.serialize = requireSerialize();
  Database2.prototype.function = require_function();
  Database2.prototype.aggregate = requireAggregate();
  Database2.prototype.table = requireTable();
  Database2.prototype.loadExtension = wrappers2.loadExtension;
  Database2.prototype.exec = wrappers2.exec;
  Database2.prototype.close = wrappers2.close;
  Database2.prototype.defaultSafeIntegers = wrappers2.defaultSafeIntegers;
  Database2.prototype.unsafeMode = wrappers2.unsafeMode;
  Database2.prototype[util.inspect] = requireInspect();
  return Database2;
};
function arrayFactory(...values) {
  return values;
}
function arrayAppender(array, ...values) {
  const offset = array.length;
  for (let i = 0; i < values.length; ++i) {
    array[offset + i] = values[i];
  }
}
function rowFactory(...keys) {
  if (!keys.includes("__proto__")) {
    const parameters = keys.map((_, index) => `v${index}`).join(",");
    const properties = keys.map((key, index) => `${JSON.stringify(key)}:v${index}`).join(",");
    return Function(`return (${parameters}) => ({${properties}})`)();
  }
  return (...values) => {
    const row = {};
    for (let i = 0; i < keys.length; ++i) row[keys[i]] = values[i];
    return row;
  };
}
function recordFactory(value) {
  return { value, done: false };
}
function commonjsRequire(path2) {
  throw new Error('Could not dynamically require "' + path2 + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var binding = { exports: {} };
(function(module, exports) {
  const fs2 = require$$0;
  const path2 = require$$1;
  const PREBUILD_PLATFORMS = ["linux", "darwin", "win32"];
  const PREBUILD_ARCHS = ["x64", "arm64"];
  let DEFAULT_ADDON;
  function getBinding(nativeBinding) {
    if (typeof nativeBinding === "string") {
      const requireFunc = typeof __non_webpack_require__ === "function" ? __non_webpack_require__ : commonjsRequire;
      return requireFunc(path2.resolve(nativeBinding).replace(/(\.node)?$/, ".node"));
    }
    if (typeof nativeBinding === "object" && nativeBinding !== null) {
      return nativeBinding;
    }
    if (DEFAULT_ADDON) {
      return DEFAULT_ADDON;
    }
    let filename = getPrebuildPath();
    if (filename) {
      return DEFAULT_ADDON = commonjsRequire(filename);
    }
    filename = path2.join(__dirname, "..", "build", "Debug", "better_sqlite3.node");
    if (!fs2.existsSync(filename)) {
      filename = path2.join(__dirname, "..", "build", "Release", "better_sqlite3.node");
    }
    return DEFAULT_ADDON = commonjsRequire(filename);
  }
  function getPrebuildPath() {
    if (PREBUILD_PLATFORMS.includes(process.platform) && PREBUILD_ARCHS.includes(process.arch)) {
      const target = `${isLinuxMusl() ? "linuxmusl" : process.platform}-${process.arch}`;
      const filename = path2.join(__dirname, "..", "prebuilds", `${target}.node`);
      if (fs2.existsSync(filename)) {
        return filename;
      }
    }
    return null;
  }
  function isLinuxMusl() {
    return process.platform === "linux" && !process.report.getReport().header.glibcVersionRuntime;
  }
  exports.getBinding = getBinding;
  exports.getPrebuildPath = getPrebuildPath;
  if (require.main === module) {
    process.stdout.write(getPrebuildPath() ? "1" : "0");
  }
})(binding, binding.exports);
var bindingExports = binding.exports;
lib.exports = database(bindingExports.getBinding, true);
lib.exports.SqliteError = sqliteError;
var libExports = lib.exports;
const Database = /* @__PURE__ */ getDefaultExportFromCjs(libExports);
const __dirname$2 = path$1.dirname(fileURLToPath(import.meta.url));
let db = null;
function getDatabase() {
  if (db) return db;
  const userDataPath = app.getPath("userData");
  const dbPath = path$1.join(userDataPath, "offline-pos.db");
  db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  const schemaPath = path$1.join(__dirname$2, "schema.sql");
  const schema = fs$1.readFileSync(schemaPath, "utf-8");
  db.exec(schema);
  return db;
}
function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}
function createProduct(data) {
  const db2 = getDatabase();
  const stmt = db2.prepare(`
    INSERT INTO products (name, category, price, quantity, min_stock, barcode, description)
    VALUES (@name, @category, @price, @quantity, @min_stock, @barcode, @description)
  `);
  const result = stmt.run(data);
  return getProductById(result.lastInsertRowid);
}
function getAllProducts() {
  const db2 = getDatabase();
  return db2.prepare("SELECT * FROM products ORDER BY name ASC").all();
}
function getProductById(id) {
  const db2 = getDatabase();
  return db2.prepare("SELECT * FROM products WHERE id = ?").get(id);
}
function getProductByBarcode(barcode) {
  const db2 = getDatabase();
  return db2.prepare("SELECT * FROM products WHERE barcode = ?").get(barcode);
}
function updateProduct(id, data) {
  const db2 = getDatabase();
  const current = getProductById(id);
  if (!current) return void 0;
  const merged = { ...current, ...data };
  db2.prepare(`
    UPDATE products
    SET name = @name,
        category = @category,
        price = @price,
        quantity = @quantity,
        min_stock = @min_stock,
        barcode = @barcode,
        description = @description,
        updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
    WHERE id = @id
  `).run({ ...merged, id });
  return getProductById(id);
}
function deleteProduct(id) {
  const db2 = getDatabase();
  const result = db2.prepare("DELETE FROM products WHERE id = ?").run(id);
  return result.changes > 0;
}
function getLowStockProducts() {
  const db2 = getDatabase();
  return db2.prepare(
    "SELECT * FROM products WHERE quantity <= min_stock ORDER BY quantity ASC"
  ).all();
}
function getProductCountByCategory() {
  const db2 = getDatabase();
  return db2.prepare(`
    SELECT category, COUNT(*) as count
    FROM products
    GROUP BY category
    ORDER BY count DESC
  `).all();
}
function searchProducts(query) {
  const db2 = getDatabase();
  const like = `%${query}%`;
  return db2.prepare(`
    SELECT * FROM products
    WHERE name LIKE ? OR category LIKE ? OR barcode LIKE ?
    ORDER BY name ASC
  `).all(like, like, like);
}
function registerInventoryHandlers() {
  ipcMain.handle("products:getAll", () => {
    return getAllProducts();
  });
  ipcMain.handle("products:getById", (_e, id) => {
    return getProductById(id);
  });
  ipcMain.handle("products:getByBarcode", (_e, barcode) => {
    return getProductByBarcode(barcode);
  });
  ipcMain.handle("products:search", (_e, query) => {
    return searchProducts(query);
  });
  ipcMain.handle("products:create", (_e, data) => {
    return createProduct(data);
  });
  ipcMain.handle("products:update", (_e, id, data) => {
    return updateProduct(id, data);
  });
  ipcMain.handle("products:delete", (_e, id) => {
    return deleteProduct(id);
  });
  ipcMain.handle("products:getLowStock", () => {
    return getLowStockProducts();
  });
  ipcMain.handle("products:countByCategory", () => {
    return getProductCountByCategory();
  });
}
function createSale(data) {
  const db2 = getDatabase();
  const insertSale = db2.prepare(`
    INSERT INTO sales (cashier_user_id, customer_id, total, mode)
    VALUES (@cashier_user_id, @customer_id, @total, @mode)
  `);
  const insertItem = db2.prepare(`
    INSERT INTO sale_items (sale_id, product_id, qty, unit_price)
    VALUES (@sale_id, @product_id, @qty, @unit_price)
  `);
  const decrementStock = db2.prepare(`
    UPDATE products
    SET quantity = quantity - @qty,
        updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
    WHERE id = @product_id
  `);
  const transaction2 = db2.transaction((input) => {
    const result = insertSale.run({
      cashier_user_id: input.cashier_user_id,
      customer_id: input.customer_id ?? null,
      total: input.total,
      mode: input.mode ?? "single"
    });
    const saleId = result.lastInsertRowid;
    for (const item of input.items) {
      insertItem.run({ sale_id: saleId, ...item });
      decrementStock.run({ qty: item.qty, product_id: item.product_id });
    }
    return getSaleById(saleId);
  });
  return transaction2(data);
}
function getAllSales() {
  const db2 = getDatabase();
  return db2.prepare("SELECT * FROM sales ORDER BY timestamp DESC").all();
}
function getSaleById(id) {
  const db2 = getDatabase();
  const sale = db2.prepare("SELECT * FROM sales WHERE id = ?").get(id);
  if (!sale) return void 0;
  const items = db2.prepare("SELECT * FROM sale_items WHERE sale_id = ?").all(id);
  return { ...sale, items };
}
function updateSale(id, data) {
  const db2 = getDatabase();
  const current = db2.prepare("SELECT * FROM sales WHERE id = ?").get(id);
  if (!current) return void 0;
  const merged = { ...current, ...data };
  db2.prepare(`
    UPDATE sales
    SET customer_id = @customer_id, total = @total, mode = @mode
    WHERE id = @id
  `).run({ ...merged, id });
  return db2.prepare("SELECT * FROM sales WHERE id = ?").get(id);
}
function deleteSale(id) {
  const db2 = getDatabase();
  const result = db2.prepare("DELETE FROM sales WHERE id = ?").run(id);
  return result.changes > 0;
}
function getDailyRevenue(days = 30) {
  const db2 = getDatabase();
  return db2.prepare(`
    SELECT
      strftime('%Y-%m-%d', timestamp) as date,
      SUM(total)    as revenue,
      COUNT(*)      as count
    FROM sales
    WHERE timestamp >= datetime('now', ? || ' days')
    GROUP BY date
    ORDER BY date ASC
  `).all(`-${days}`);
}
function getTopProducts(limit = 10) {
  const db2 = getDatabase();
  return db2.prepare(`
    SELECT
      si.product_id,
      p.name,
      SUM(si.qty)                   as total_qty,
      SUM(si.qty * si.unit_price)   as total_revenue
    FROM sale_items si
    JOIN products p ON p.id = si.product_id
    GROUP BY si.product_id
    ORDER BY total_qty DESC
    LIMIT ?
  `).all(limit);
}
function getRevenueInRange(from, to) {
  const db2 = getDatabase();
  return db2.prepare(`
    SELECT COALESCE(SUM(total), 0) as total_revenue, COUNT(*) as sale_count
    FROM sales
    WHERE timestamp BETWEEN ? AND ?
  `).get(from, to);
}
function registerBillingHandlers() {
  ipcMain.handle("billing:createSale", (_e, data) => {
    return createSale(data);
  });
  ipcMain.handle("billing:getAllSales", () => {
    return getAllSales();
  });
  ipcMain.handle("billing:getSaleById", (_e, id) => {
    return getSaleById(id);
  });
  ipcMain.handle(
    "billing:updateSale",
    (_e, id, data) => {
      return updateSale(id, data);
    }
  );
  ipcMain.handle("billing:deleteSale", (_e, id) => {
    return deleteSale(id);
  });
  ipcMain.handle("billing:getDailyRevenue", (_e, days) => {
    return getDailyRevenue(days);
  });
  ipcMain.handle("billing:getTopProducts", (_e, limit) => {
    return getTopProducts(limit);
  });
  ipcMain.handle("billing:getRevenueInRange", (_e, from, to) => {
    return getRevenueInRange(from, to);
  });
}
function createCustomer(data) {
  const db2 = getDatabase();
  const stmt = db2.prepare(`
    INSERT INTO customers (name, phone, email, address, notes)
    VALUES (@name, @phone, @email, @address, @notes)
  `);
  const result = stmt.run(data);
  return getCustomerById(result.lastInsertRowid);
}
function getAllCustomers() {
  const db2 = getDatabase();
  return db2.prepare("SELECT * FROM customers ORDER BY name ASC").all();
}
function getCustomerById(id) {
  const db2 = getDatabase();
  return db2.prepare("SELECT * FROM customers WHERE id = ?").get(id);
}
function updateCustomer(id, data) {
  const db2 = getDatabase();
  const current = getCustomerById(id);
  if (!current) return void 0;
  const merged = { ...current, ...data };
  db2.prepare(`
    UPDATE customers
    SET name = @name, phone = @phone, email = @email, address = @address, notes = @notes
    WHERE id = @id
  `).run({ ...merged, id });
  return getCustomerById(id);
}
function deleteCustomer(id) {
  const db2 = getDatabase();
  const result = db2.prepare("DELETE FROM customers WHERE id = ?").run(id);
  return result.changes > 0;
}
function searchCustomers(query) {
  const db2 = getDatabase();
  const like = `%${query}%`;
  return db2.prepare(`
    SELECT * FROM customers
    WHERE name LIKE ? OR phone LIKE ? OR email LIKE ?
    ORDER BY name ASC
  `).all(like, like, like);
}
function getCustomerPurchaseHistory(customerId) {
  const db2 = getDatabase();
  return db2.prepare(`
    SELECT id as sale_id, timestamp, total
    FROM sales
    WHERE customer_id = ?
    ORDER BY timestamp DESC
  `).all(customerId);
}
function registerCustomersHandlers() {
  ipcMain.handle("customers:getAll", () => {
    return getAllCustomers();
  });
  ipcMain.handle("customers:getById", (_e, id) => {
    return getCustomerById(id);
  });
  ipcMain.handle("customers:search", (_e, query) => {
    return searchCustomers(query);
  });
  ipcMain.handle("customers:create", (_e, data) => {
    return createCustomer(data);
  });
  ipcMain.handle(
    "customers:update",
    (_e, id, data) => {
      return updateCustomer(id, data);
    }
  );
  ipcMain.handle("customers:delete", (_e, id) => {
    return deleteCustomer(id);
  });
  ipcMain.handle("customers:purchaseHistory", (_e, customerId) => {
    return getCustomerPurchaseHistory(customerId);
  });
}
function createUser(data) {
  const db2 = getDatabase();
  const stmt = db2.prepare(`
    INSERT INTO users (name, phone, email, role)
    VALUES (@name, @phone, @email, @role)
  `);
  const result = stmt.run(data);
  return getUserById(result.lastInsertRowid);
}
function getAllUsers() {
  const db2 = getDatabase();
  return db2.prepare("SELECT * FROM users ORDER BY name ASC").all();
}
function getUserById(id) {
  const db2 = getDatabase();
  return db2.prepare("SELECT * FROM users WHERE id = ?").get(id);
}
function updateUser(id, data) {
  const db2 = getDatabase();
  const current = getUserById(id);
  if (!current) return void 0;
  const merged = { ...current, ...data };
  db2.prepare(`
    UPDATE users
    SET name = @name, phone = @phone, email = @email, role = @role
    WHERE id = @id
  `).run({ ...merged, id });
  return getUserById(id);
}
function deleteUser(id) {
  const db2 = getDatabase();
  const result = db2.prepare("DELETE FROM users WHERE id = ?").run(id);
  return result.changes > 0;
}
function getUserSalesSummary() {
  const db2 = getDatabase();
  return db2.prepare(`
    SELECT u.id as user_id, u.name, COUNT(s.id) as sale_count, COALESCE(SUM(s.total), 0) as total_revenue
    FROM users u
    LEFT JOIN sales s ON s.cashier_user_id = u.id
    GROUP BY u.id
    ORDER BY total_revenue DESC
  `).all();
}
function registerUsersHandlers() {
  ipcMain.handle("users:getAll", () => {
    return getAllUsers();
  });
  ipcMain.handle("users:getById", (_e, id) => {
    return getUserById(id);
  });
  ipcMain.handle("users:create", (_e, data) => {
    return createUser(data);
  });
  ipcMain.handle(
    "users:update",
    (_e, id, data) => {
      return updateUser(id, data);
    }
  );
  ipcMain.handle("users:delete", (_e, id) => {
    return deleteUser(id);
  });
  ipcMain.handle("users:salesSummary", () => {
    return getUserSalesSummary();
  });
}
function createAsset(data) {
  const db2 = getDatabase();
  const result = db2.prepare(`
    INSERT INTO assets
      (name, category, brand, quantity, condition, status, purchase_price,
       purchase_date, warranty_expiry, issued_by, issue_date, issued_to)
    VALUES
      (@name, @category, @brand, @quantity, @condition, @status, @purchase_price,
       @purchase_date, @warranty_expiry, @issued_by, @issue_date, @issued_to)
  `).run(data);
  return getAssetById(result.lastInsertRowid);
}
function getAllAssets() {
  const db2 = getDatabase();
  return db2.prepare("SELECT * FROM assets ORDER BY name ASC").all();
}
function getAssetById(id) {
  const db2 = getDatabase();
  return db2.prepare("SELECT * FROM assets WHERE id = ?").get(id);
}
function updateAsset(id, data) {
  const db2 = getDatabase();
  const current = getAssetById(id);
  if (!current) return void 0;
  const merged = { ...current, ...data };
  db2.prepare(`
    UPDATE assets
    SET name = @name, category = @category, brand = @brand, quantity = @quantity,
        condition = @condition, status = @status, purchase_price = @purchase_price,
        purchase_date = @purchase_date, warranty_expiry = @warranty_expiry,
        issued_by = @issued_by, issue_date = @issue_date, issued_to = @issued_to
    WHERE id = @id
  `).run({ ...merged, id });
  return getAssetById(id);
}
function deleteAsset(id) {
  const db2 = getDatabase();
  const result = db2.prepare("DELETE FROM assets WHERE id = ?").run(id);
  return result.changes > 0;
}
function getWarrantyExpiringSoon(withinDays = 30) {
  const db2 = getDatabase();
  return db2.prepare(`
    SELECT * FROM assets
    WHERE warranty_expiry != ''
      AND date(warranty_expiry) BETWEEN date('now') AND date('now', ? || ' days')
    ORDER BY warranty_expiry ASC
  `).all(`+${withinDays}`);
}
function getAssetsByStatus(status) {
  const db2 = getDatabase();
  return db2.prepare("SELECT * FROM assets WHERE status = ? ORDER BY name ASC").all(status);
}
function registerAssetsHandlers() {
  ipcMain.handle("assets:getAll", () => {
    return getAllAssets();
  });
  ipcMain.handle("assets:getById", (_e, id) => {
    return getAssetById(id);
  });
  ipcMain.handle("assets:create", (_e, data) => {
    return createAsset(data);
  });
  ipcMain.handle(
    "assets:update",
    (_e, id, data) => {
      return updateAsset(id, data);
    }
  );
  ipcMain.handle("assets:delete", (_e, id) => {
    return deleteAsset(id);
  });
  ipcMain.handle("assets:getWarrantyExpiringSoon", (_e, withinDays) => {
    return getWarrantyExpiringSoon(withinDays);
  });
  ipcMain.handle("assets:getByStatus", (_e, status) => {
    return getAssetsByStatus(status);
  });
}
function getSettings() {
  const db2 = getDatabase();
  return db2.prepare("SELECT * FROM settings WHERE id = 1").get();
}
function updateSettings(data) {
  const db2 = getDatabase();
  const current = getSettings();
  const merged = { ...current, ...data };
  db2.prepare(`
    UPDATE settings
    SET shop_name           = @shop_name,
        shop_email          = @shop_email,
        registration_number = @registration_number,
        currency            = @currency,
        logo_path           = @logo_path,
        bill_logo_path      = @bill_logo_path,
        admin_password_hash = @admin_password_hash
    WHERE id = 1
  `).run(merged);
  return getSettings();
}
function setAdminPasswordHash(hash) {
  const db2 = getDatabase();
  db2.prepare("UPDATE settings SET admin_password_hash = ? WHERE id = 1").run(hash);
}
function registerSettingsHandlers() {
  ipcMain.handle("settings:get", () => {
    return getSettings();
  });
  ipcMain.handle(
    "settings:update",
    (_e, data) => {
      return updateSettings(data);
    }
  );
  ipcMain.handle("settings:setAdminPasswordHash", (_e, hash) => {
    setAdminPasswordHash(hash);
    return true;
  });
}
const __dirname$1 = path$1.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path$1.join(__dirname$1, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path$1.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path$1.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path$1.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    icon: path$1.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path$1.join(__dirname$1, "preload.mjs")
    }
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path$1.join(RENDERER_DIST, "index.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.on("before-quit", () => {
  closeDatabase();
});
app.whenReady().then(() => {
  getDatabase();
  registerInventoryHandlers();
  registerBillingHandlers();
  registerCustomersHandlers();
  registerUsersHandlers();
  registerAssetsHandlers();
  registerSettingsHandlers();
  createWindow();
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
