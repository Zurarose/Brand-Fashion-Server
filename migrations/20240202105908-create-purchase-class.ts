'use strict';

import {createAndGetSchema} from './lib/getSchema';

exports.up = async (db: string | {}, next: Function) => {
  try {
    const {instance, schemaFields} = await createAndGetSchema('Purchase');

    if (!schemaFields.includes('User')) instance.addPointer('User', '_User');

    if (!schemaFields.includes('itemName')) instance.addString('itemName');

    if (!schemaFields.includes('bonuseReceived')) instance.addNumber('bonuseReceived', {defaultValue: 0});

    if (!schemaFields.includes('price')) instance.addNumber('price', {defaultValue: 0});

    if (!schemaFields.includes('date')) instance.addDate('date');

    if (!schemaFields.includes('usedBonuses')) instance.addNumber('usedBonuses', {defaultValue: 0});

    await instance.update();
  } catch (e) {
    console.log(e);
  }
  return next();
};

exports.down = (db: string | {}, next: Function) => next();
