import Client from '../classes/Client';

Parse.Cloud.define(
  'giftBonuses',
  async (request) => {
    const {userId, amount, limited} = request.params;
    const user = request.user;
    if (!user) throw new Error('Authentication required');

    const client = await new Parse.Query(Client._className).equalTo('objectId', userId).first({useMasterKey: true});

    if (!client) return false;

    limited ? client.increment('giftedBonuses', amount) : client.increment('bonuses', amount);

    if (limited) client.set('lastGiftDate', new Date());
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
      limited: {
        required: true,
        type: Boolean,
        error: 'if bonuses limited is requried field',
      },
    },
    requireUser: true,
    requireAllUserRoles: ['admin'],
  },
);
