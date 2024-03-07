import Client from '../classes/Client';

Parse.Cloud.define(
  'setBonuses',
  async (request) => {
    const {userId, amountgifted, amount} = request.params;
    const user = request.user;
    if (!user) throw new Error('Authentication required');

    const client = await new Parse.Query(Client._className).equalTo('objectId', userId).first({useMasterKey: true});

    if (!client) return false;

    client.set('giftedBonuses', amountgifted);
    client.set('bonuses', amount);

    if (amountgifted !== client.get('giftedBonuses')) client.set('lastGiftDate', new Date());
    await client.save(null, {useMasterKey: true});
    return true;
  },
  {
    fields: {
      userId: {
        required: true,
        type: String,
        error: 'userId is requried field',
      },
      amount: {
        required: true,
        type: Number,
        error: 'amount number is requried field',
      },
      amountgifted: {
        required: true,
        type: Number,
        error: 'Gifted bonuses number is requried field',
      },
    },
    requireUser: true,
    requireAllUserRoles: ['admin'],
  },
);
