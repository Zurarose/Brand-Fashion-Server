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
  addField: {[`role:${ADMIN}`]: true},
};

const USER_CPL = {
  get: {
    ['requiresAuthentication']: true,
    [`role:${ADMIN}`]: true,
    [`role:${USER}`]: true,
  },
  find: {
    ['requiresAuthentication']: true,
    [`role:${ADMIN}`]: true,
    [`role:${USER}`]: true,
  },
  count: {
    ['requiresAuthentication']: true,
    [`role:${ADMIN}`]: true,
    [`role:${USER}`]: true,
  },
  update: {
    ['requiresAuthentication']: true,
    [`role:${ADMIN}`]: true,
    [`role:${USER}`]: true,
  },
  delete: {
    ['requiresAuthentication']: true,
    [`role:${ADMIN}`]: true,
  },
  addField: {
    [`role:${ADMIN}`]: true,
  },
  create: {
    ['requiresAuthentication']: true,
    [`role:${USER}`]: true,
    [`role:${ADMIN}`]: true,
  },
};

exports.up = async function (db: string | {}, next: Function) {
  await Promise.all([
    new Parse.Schema('_Role').setCLP(ROLE_CPL).update(),
    new Parse.Schema('_User').setCLP(USER_CPL).update(),
  ]);

  const rolesACL = new Parse.ACL();
  rolesACL.setPublicReadAccess(true);

  await Promise.all([
    new Parse.Role(ADMIN, rolesACL).save(null, {useMasterKey: true}),
    new Parse.Role(USER, rolesACL).save(null, {useMasterKey: true}),
  ]);
  return next();
};
exports.down = (db: any, next: Function) => next();
