'use strict';

import Parse from './lib/initParse';

exports.up = async function (db: string | {}, next: Function) {
  const adminRole = await new Parse.Query(Parse.Role).equalTo('name', 'admin').first({useMasterKey: true});
  const admin = new Parse.User();
  admin.set('username', 'admin');
  admin.set('email', 'baseadmin@mail.com');
  admin.set('emailVerified', true);
  admin.set('password', '123456');

  await admin.save(null, {useMasterKey: true});
  (adminRole as any).getUsers().add(admin);
  await (adminRole as any).save({}, {useMasterKey: true});

  return next();
};
// FIXME:fix unsafe member access .down on an `any` value, unsafe return of an `any` typed value
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
exports.down = (db: string | {}, next: Function) => next();
