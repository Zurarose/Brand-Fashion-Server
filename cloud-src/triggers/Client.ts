'use strict';

import Model from '../classes/Client';
import CloudTriggers from '../lib/CloudTriggers';
import {ROLE_NAMES} from '../lib/constants';

//SET ACL
CloudTriggers.beforeSave(Model._className, (request) => {
  const object = request.object as Model;
  const isNew = !request.original;
  if (!isNew) return false;

  const acl = new Parse.ACL();
  acl.setRoleReadAccess(ROLE_NAMES.admin, true);
  acl.setRoleWriteAccess(ROLE_NAMES.admin, true);
  object.setACL(acl);
  return true;
});

//CHECK UNIQUE PHONE
CloudTriggers.beforeSave(Model._className, async (request) => {
  const object = request.object as Model;
  const isNew = !request.original;
  if (!isNew) return false;

  const phone = object.get('phone');
  if (!phone) return false;
  const count = await new Parse.Query(Model._className).equalTo('phone', phone).count({useMasterKey: true});
  if (count > 0) throw new Error('User already exists');
  return true;
});
