'use strict';
import Parse from './lib/initParse';
exports.up = async function (db: string | {}, next: Function) {
  try {
    await Parse.Config.save({
      LIMITED_BONUSES_TIMEOUT_DAYS: 7,
      GETTING_PERCENT_BONUSES: 2.5,
      GIFT_BONUSES_USER_BIRTHDAY: 500,
    });
  } catch (e) {
    console.log(e);
  }

  return next();
};

exports.down = (db: string | {}, next: Function) => next();
