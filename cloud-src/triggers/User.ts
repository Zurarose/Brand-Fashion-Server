'use strict';

import Model from '../classes/User';
import CloudTriggers from '../lib/CloudTriggers';
import {USER_STATUSES, ROLE_NAMES} from '../lib/constants';

/*
 * Trigger beforeLogin should be in one copy.
 * Usage of CloudTriggers is not necessary.
 * */

Parse.Cloud.beforeLogin((request) => {
  const {object: user} = request;

  if (user.get('status') === USER_STATUSES.block) {
    throw new Error('Access denied, you have been blocked.');
  }
});
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
