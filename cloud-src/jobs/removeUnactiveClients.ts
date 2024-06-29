import Client from '../classes/Client';
const JOB_NAME = 'Remove_Unactive_Clients';
import Logs from '../classes/Logs';

Parse.Cloud.job(JOB_NAME, async () => {
  const jobs = await new Parse.Query('_JobStatus')
    .equalTo('jobName', JOB_NAME)
    .equalTo('status', 'running')
    .count({useMasterKey: true});
  if (jobs > 1) throw Error('decline job: already running');
  console.log(`${JOB_NAME} - START`);

  const currentTime = new Date().getTime();
  const yearInMs = 1000 * 60 * 60 * 24 * 365;

  await new Parse.Query(Client._className).each(
    async (client) => {
      try {
        const purchase = await client.relation('Purchases').query().descending('date').first({useMasterKey: true});
        if (!purchase?.get('createdAt') || !new Date(purchase?.get('createdAt')).getTime()) return;
        const lastPurchaseDate = new Date(purchase?.get('createdAt')).getTime();
        if (currentTime - lastPurchaseDate > yearInMs) {
          const log = new Parse.Object(Logs._className);
          log.set('text', 'unactive client deleted');
          log.set('data', client?.toJSON());
          await Promise.all([await client.destroy({useMasterKey: true}), await log.save(null, {useMasterKey: true})]);
        }
      } catch (error) {
        console.log(error);
      }
    },
    {useMasterKey: true},
  );
  console.log(`${JOB_NAME} - END`);
  return;
});
