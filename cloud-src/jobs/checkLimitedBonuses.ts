import Client from '../classes/Client';
import {ENV_VAR_NAMES} from '../lib/constants';

const JOB_NAME = 'Check_Limited_Bonuses';

Parse.Cloud.job(JOB_NAME, async () => {
  const jobs = await new Parse.Query('_JobStatus')
    .equalTo('jobName', JOB_NAME)
    .equalTo('status', 'running')
    .count({useMasterKey: true});
  if (jobs > 1) throw Error('decline job: already running');
  console.log(`${JOB_NAME} - START`);

  const config = await Parse.Config.get({useMasterKey: true});
  const dayLimits = Number(config.get(ENV_VAR_NAMES.LIMITED_BONUSES_TIMEOUT_DAYS) || 0);

  await new Parse.Query(Client._className).lessThan('lastGiftDate', {$relativeTime: `${dayLimits} days ago`}).each(
    async (item) => {
      console.log('ITEM ID', item.id);
      item.set('lastGiftDate', undefined);
      item.set('giftedBonuses', 0);
      await item.save(null, {useMasterKey: true});
    },
    {useMasterKey: true},
  );
  console.log(`${JOB_NAME} - END`);

  return;
});
