import User from '../classes/User';
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

  await new Parse.Query(User._className).each(
    async (user) => {
      const giftDay = user.get('lastGiftDate') || 0;
      const lastGiftDay = `${new Date(giftDay).getDate()}/${new Date(giftDay).getMonth()}`;

      if (lastGiftDay === currentDay) return;

      const birthdayDate = user.get('birthday');
      if (!birthdayDate) return;

      const birthday = `${new Date(birthdayDate).getDate()}/${new Date(birthdayDate).getMonth()}`;
      if (birthday === currentDay) {
        user.increment('giftedBonuses', giftAmount);
        user.set('lastGiftDate', new Date());
        await user.save(null, {useMasterKey: true});
      }
    },
    {useMasterKey: true},
  );
  console.log(`${JOB_NAME} - END`);
  return;
});
