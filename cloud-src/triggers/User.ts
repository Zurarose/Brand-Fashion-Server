'use strict';

import Model from '../classes/User';
import CloudTriggers from '../lib/CloudTriggers';
import {ROLE_NAMES} from '../lib/constants';

//as afterRegistration trigger to set ACL
CloudTriggers.beforeSave(Model._className, (request) => {
  if (request.original) return false;
  const {object: user} = request;
  const aclUser = new Parse.ACL();
  aclUser.setRoleReadAccess(ROLE_NAMES.admin, true);
  aclUser.setPublicReadAccess(true);
  user.setACL(aclUser);
  return true;
});
