'use strict';

import {createAndGetSchema} from './lib/getSchema';

exports.up = async (db: string | {}, next: Function) => {
  try {
    const {instance, schemaFields} = await createAndGetSchema('_User');

    if (!schemaFields.includes('fullName')) instance.addString('fullName');

    if (!schemaFields.includes('birthday')) instance.addDate('birthday');

    if (!schemaFields.includes('bonuses')) instance.addNumber('bonuses', {defaultValue: 0});

    if (!schemaFields.includes('giftedBonuses')) instance.addNumber('giftedBonuses', {defaultValue: 0});

    if (!schemaFields.includes('lastGiftDate')) instance.addDate('lastGiftDate');

    if (!schemaFields.includes('Purchases')) instance.addRelation('Purchases', 'Purchase');

    await instance.update();
  } catch (e) {
    console.log(e);
  }
  return next();
};

exports.down = (db: string | {}, next: Function) => next();
