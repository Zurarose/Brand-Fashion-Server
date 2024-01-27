'use strict';

import Parse from './initParse';

export async function createAndGetSchema(schemaName: string) {
  const instance = new Parse.Schema(schemaName);
  let schema;
  try {
    await instance.save();
    schema = await instance.get();
  } catch (e) {
    schema = await instance.get();
  }
  // @ts-ignore
  const schemaFields = Object.keys(schema.fields);
  return {instance, schemaFields};
}
