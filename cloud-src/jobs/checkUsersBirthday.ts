import Client from '../classes/Client';
import Logs from '../classes/Logs';

import {ENV_VAR_NAMES} from '../lib/constants';

const JOB_NAME = 'Check_Users_Birthday';

Parse.Cloud.job(JOB_NAME, async () => {
  const jobs = await new Parse.Query('_JobStatus')
    .equalTo('jobName', JOB_NAME)
    .equalTo('status', 'running')
    .count({useMasterKey: true});
  if (jobs > 1) throw Error('decline job: already running');
  console.log(`${JOB_NAME} - START`);

  const currentDay = `${new Date().getDate()}/${new Date().getMonth()}`;

  const config = await Parse.Config.get({useMasterKey: true});
  const giftAmount = Number(config.get(ENV_VAR_NAMES.GIFT_BONUSES_USER_BIRTHDAY) || 0);

  await new Parse.Query(Client._className).each(
    async (client) => {
      const giftDay = client.get('lastGiftDate') || 0;
      const lastGiftDay = `${new Date(giftDay).getDate()}/${new Date(giftDay).getMonth()}`;

      if (lastGiftDay === currentDay) return;

      const birthdayDate = client.get('birthday') as Date;
      if (!birthdayDate) return;

      const birthday = `${new Date(birthdayDate).getDate()}/${new Date(birthdayDate).getMonth()}`;

      if (birthday === currentDay) {
        client.increment('giftedBonuses', giftAmount);
        client.set('lastGiftDate', new Date());
        const log = new Parse.Object(Logs._className);
        log.set('text', 'birthday gift added');
        log.set('data', client?.toJSON());
        await Promise.all([await client.save(null, {useMasterKey: true}), await log.save(null, {useMasterKey: true})]);
      }
    },
    {useMasterKey: true},
  );
  console.log(`${JOB_NAME} - END`);
  return;
});
