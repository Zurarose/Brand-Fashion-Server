'use strict';
import Parse from './lib/initParse';
import {readFile} from 'fs/promises';
import path from 'path';
type UsersJsonT = {
  ID: string;
  Name: string;
  BDate: string;
  Phone: string;
  Password: string;
  Total_bonus: string;
  Status: string;
}[];
exports.up = async function (db: string | {}, next: Function) {
  try {
    const jsonData: UsersJsonT = await readFile(path.resolve(__dirname, './old-data/users.json'), {
      encoding: 'utf-8',
    }).then((data) => JSON.parse(data));
    console.log(jsonData);
    for (const i of jsonData) {
      const newClient = new Parse.Object('Client');
      newClient.set('fullName', i.Name);
      newClient.set('birthday', new Date(i.BDate));
      newClient.set('phone', `+38${i.Phone}`);
      newClient.set('bonuses', Number(Number(i.Total_bonus)?.toFixed(2)));
      await newClient.save(null, {useMasterKey: true});
    }
  } catch (e) {
    console.log(e);
  }

  return next();
};

exports.down = (db: string | {}, next: Function) => next();
