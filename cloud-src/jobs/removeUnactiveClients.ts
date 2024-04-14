import Client from '../classes/Client';
const JOB_NAME = 'Remove_Unactive_Clients';

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
        if (!purchase?.get('date') || !new Date(purchase?.get('date')).getTime()) return;
        const lastPurchaseDate = new Date(purchase?.get('date')).getTime();
        if (currentTime - lastPurchaseDate > yearInMs) {
          await client.destroy({useMasterKey: true});
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
