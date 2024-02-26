'use strict';

import Model from '../classes/Purchase';
import Client from '../classes/Client';
import CloudTriggers from '../lib/CloudTriggers';
import {ENV_VAR_NAMES, ROLE_NAMES} from '../lib/constants';

//as afterRegistration trigger to set ACL
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

CloudTriggers.beforeSave(Model._className, async (request) => {
  const object = request.object as Model;
  const isNew = !request.original;
  if (!isNew || !object.get('Client')?.id) return false;
  const config = await Parse.Config.get({useMasterKey: true});

  const client = await new Parse.Query(Client._className).get(object.get('Client')?.id, {useMasterKey: true});

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

  if (!clientGiftedBonuses) client.increment('bonuses', newBonuses);
  return client.save(null, {useMasterKey: true});
});
