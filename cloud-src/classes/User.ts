'use strict';
const CLASS_NAME = '_User';

class User extends Parse.User {
  static _className: string = CLASS_NAME;
  _roles: {
    name: string;
  }[];

  constructor() {
    super();
    this._roles = [];
  }
}

Parse.Object.registerSubclass(CLASS_NAME, User);

export default User;
