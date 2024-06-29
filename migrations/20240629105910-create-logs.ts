'use strict';

import {createAndGetSchema} from './lib/getSchema';

exports.up = async (db: string | {}, next: Function) => {
  try {
    const {instance, schemaFields} = await createAndGetSchema('Logs');

    if (!schemaFields.includes('text')) instance.addString('text');

    if (!schemaFields.includes('data')) instance.addObject('data');

    await instance.update();
  } catch (e) {
    console.log(e);
  }
  return next();
};

exports.down = (db: string | {}, next: Function) => next();
