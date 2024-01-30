'use strict';

import Parse from './lib/initParse';

exports.up = async (db: string | {}, next: Function) => {
  try {
    const adminRole = await new Parse.Query(Parse.Role).equalTo('name', 'admin').first({useMasterKey: true});

    const admin = new Parse.User();
    admin.set('username', 'admin');
    admin.set('email', 'baseadmin@mail.com');
    admin.set('emailVerified', true);
    admin.set('password', '123456');

    await admin.save(null, {useMasterKey: true});

    (adminRole as any).getUsers().add(admin);

    await (adminRole as any).save({}, {useMasterKey: true});
  } catch (e) {
    console.log(e);
  }
  return next();
};

exports.down = (db: string | {}, next: Function) => next();
