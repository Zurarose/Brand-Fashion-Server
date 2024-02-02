'use strict';

import Model from '../classes/Purchase';
import User from '../classes/User';
import CloudTriggers from '../lib/CloudTriggers';
import {ENV_VAR_NAMES, ROLE_NAMES} from '../lib/constants';

//as afterRegistration trigger to set ACL
CloudTriggers.beforeSave(Model._className, (request) => {
  const object = request.object as Model;
  const isNew = !request.original;
  const user = request.user;
  if (!isNew || !user) return false;

  const acl = new Parse.ACL();
  acl.setRoleReadAccess(ROLE_NAMES.admin, true);
  acl.setRoleWriteAccess(ROLE_NAMES.admin, true);
  acl.setPublicReadAccess(true);
  acl.setReadAccess(user, true);
  acl.setWriteAccess(user, true);
  object.setACL(acl);
  return true;
});

CloudTriggers.beforeSave(Model._className, async (request) => {
  const object = request.object as Model;
  const isNew = !request.original;
  const user = request.user;
  if (!isNew || !user || !object.get('User')?.id) return false;
  const config = await Parse.Config.get({useMasterKey: true});

  const client = await new Parse.Query(User._className).get(object.get('User')?.id, {useMasterKey: true});

  const percent = Number(config.get(ENV_VAR_NAMES.GETTING_PERCENT_BONUSES) || 0);
  const price = Number(object.get('price') || 0);

  const clientGiftedBonuses = Number(client.get('giftedBonuses') || 0);

  const clientBonuses = Number(client.get('bonuses') || 0);

  const usedBonuses = Number(object.get('usedBonuses') || 0);

  if (clientGiftedBonuses + clientBonuses < usedBonuses) throw new Error('Insufficient amount of bonuses');

  if (clientGiftedBonuses > 0) {
    const newGiftedAmount = clientGiftedBonuses - usedBonuses;
    if (newGiftedAmount < 0) {
      client.set('giftedBonuses', 0);
      client.decrement('bonuses', Math.abs(newGiftedAmount));
    } else client.set('giftedBonuses', newGiftedAmount);
  } else {
    client.decrement('bonuses', usedBonuses);
  }

  const newBonuses = (price / 100) * percent;
  object.set('bonuseReceived', newBonuses);

  if (!clientGiftedBonuses && usedBonuses) client.increment('bonuses', newBonuses);
  return client.save(null, {useMasterKey: true});
});
