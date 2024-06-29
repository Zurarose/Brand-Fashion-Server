'use strict';
const CLASS_NAME = __filename.replace(/^.*\/(\w+)\.[tj]s$/, '$1');

class Model extends Parse.Object {
  static _className: string = CLASS_NAME;

  constructor() {
    super(CLASS_NAME);
  }
}

Parse.Object.registerSubclass(CLASS_NAME, Model);

export default Model;
