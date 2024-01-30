'use strict';

import Parse from './lib/initParse';

const ADMIN = 'admin';
const USER = 'user';

const ROLE_CPL = {
  get: {
    [`role:${ADMIN}`]: true,
    [`role:${USER}`]: true,
  },
  find: {
    [`role:${ADMIN}`]: true,
    [`role:${USER}`]: true,
  },
  count: {
    [`role:${ADMIN}`]: true,
    [`role:${USER}`]: true,
  },
  create: {[`role:${ADMIN}`]: true},
  update: {[`role:${ADMIN}`]: true},
  delete: {[`role:${ADMIN}`]: true},
};

const USER_CPL = {
  get: {
    [`role:${ADMIN}`]: true,
    [`role:${USER}`]: true,
  },
  find: {
    [`role:${ADMIN}`]: true,
    [`role:${USER}`]: true,
  },
  count: {
    [`role:${ADMIN}`]: true,
    [`role:${USER}`]: true,
  },
  create: {'*': true},
  update: {
    [`role:${ADMIN}`]: true,
    [`role:${USER}`]: true,
  },
  delete: {[`role:${ADMIN}`]: true},
};

exports.up = async function (db: string | {}, next: Function) {
  try {
    await Promise.all([
      (new Parse.Schema('_Role') as any).setCLP(ROLE_CPL).update(),
      (new Parse.Schema('_User') as any).setCLP(USER_CPL).update(),
    ]);

    const rolesACL = new Parse.ACL();
    rolesACL.setPublicReadAccess(true);

    await Promise.all([
      new Parse.Role(ADMIN, rolesACL).save(null, {useMasterKey: true}),
      new Parse.Role(USER, rolesACL).save(null, {useMasterKey: true}),
    ]);
  } catch (e) {
    console.log(e);
  }

  return next();
};

exports.down = (db: any, next: Function) => next();
