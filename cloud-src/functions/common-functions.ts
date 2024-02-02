import {ENV_VAR_NAMES} from '../lib/constants';

Parse.Cloud.define('getConfig', async (request) => {
  const user = request.user;
  if (!user) throw new Error('Authentication required');

  const config = await Parse.Config.get({useMasterKey: true});

  return {
    GETTING_PERCENT_BONUSES: config.get(ENV_VAR_NAMES.GETTING_PERCENT_BONUSES),
    GIFT_BONUSES_USER_BIRTHDAY: config.get(ENV_VAR_NAMES.GIFT_BONUSES_USER_BIRTHDAY),
    LIMITED_BONUSES_TIMEOUT_DAYS: config.get(ENV_VAR_NAMES.LIMITED_BONUSES_TIMEOUT_DAYS),
  };
});

Parse.Cloud.define('setConfig', async (request) => {
  const user = request.user;
  if (!user) throw new Error('Authentication required');

  const {LIMITED_BONUSES_TIMEOUT_DAYS, GETTING_PERCENT_BONUSES, GIFT_BONUSES_USER_BIRTHDAY} = request.params;

  await Parse.Config.save({
    LIMITED_BONUSES_TIMEOUT_DAYS: LIMITED_BONUSES_TIMEOUT_DAYS,
    GETTING_PERCENT_BONUSES: GETTING_PERCENT_BONUSES,
    GIFT_BONUSES_USER_BIRTHDAY: GIFT_BONUSES_USER_BIRTHDAY,
  });

  return true;
});
