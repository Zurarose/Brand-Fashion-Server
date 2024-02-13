'use strict';

import Model from '../classes/Client';
import CloudTriggers from '../lib/CloudTriggers';
import {ROLE_NAMES} from '../lib/constants';

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
