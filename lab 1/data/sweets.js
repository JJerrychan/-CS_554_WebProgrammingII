const sweets = require('../config/mongoCollections').sweets;
const { ObjectId } = require('mongodb');
const validation = require('./validation');

async function create(sweetText, sweetMood, userThatPosted) {
  if (!sweetText || !sweetMood || !userThatPosted)
    throw 'all arguments must hava valid values!';
  sweetText = validation.checkString(sweetText, 'sweetText');
  sweetMood = validation.checkString(sweetMood, 'sweetMood');
  sweetMood = validation.checkMood(sweetMood);
  const sweetsCollections = await sweets();
  let newSweet = {
    sweetText: sweetText,
    sweetMood: sweetMood,
    userThatPosted: {
      _id: ObjectId(userThatPosted.userId),
      username: userThatPosted.username,
    },
    replies: [],
    likes: [],
  };
  const insertInfo = await sweetsCollections.insertOne(newSweet);
  if (insertInfo.insertedCount == 0) throw 'sweet create failed!';
  const sweet = await get(insertInfo.insertedId.toString());
  return sweet;
}

async function get(sweetId) {
  sweetId = validation.checkId(sweetId, 'sweetId');
  const sweetsCollections = await sweets();
  const sweet = await sweetsCollections.findOne({ _id: ObjectId(sweetId) });
  if (!sweet) throw 'there is no sweet with that id!';
  sweet._id = sweetId.toString();
  return sweet;
}

async function getFifty(page) {
  if (!Number.isInteger(page) || page < 0)
    throw `page must be an positive Integer!`;
  const sweetsCollections = await sweets();
  let fifty = await sweetsCollections
    .find({})
    .limit(50)
    .skip(page * 50)
    .toArray();
  if (fifty.length == 0) throw 'there is no more sweets!';
  fifty.forEach((element) => {
    element._id = element._id.toString();
  });
  return fifty;
}

async function patch(sweetId, sweetText, sweetMood, userThatPatched) {
  sweetId = validation.checkId(sweetId, 'sweetId');
  let sweet = await get(sweetId);
  if (sweet.userThatPosted._id.toString() != userThatPatched.userId)
    throw `cannot modified a sweet that is posted by the different user`;
  let newSweet = {};
  if (sweetText) {
    sweetText = validation.checkString(sweetText, 'sweetText');
    newSweet.sweetText = sweetText;
  }
  if (sweetMood) {
    sweetMood = validation.checkString(sweetMood, 'sweetMood');
    sweetMood = validation.checkMood(sweetMood);
    newSweet.sweetMood = sweetMood;
  }
  const sweetsCollections = await sweets();
  const updateInfo = await sweetsCollections.updateOne(
    { _id: ObjectId(sweetId) },
    { $set: newSweet }
  );
  if (updateInfo.modifiedCount == 0)
    throw `Could not patch sweet with id of ${sweetId}`;
  else return await get(sweetId);
}

async function reply(sweetId, userThatPostedReply, reply) {
  sweetId = validation.checkId(sweetId, 'sweetId');
  reply = validation.checkString(reply, 'reply');
  await get(sweetId);
  const replyObj = {
    _id: ObjectId(),
    userThatPostedReply: {
      _id: ObjectId(userThatPostedReply.userId),
      username: userThatPostedReply.username,
    },
    reply: reply,
  };
  const sweetsCollections = await sweets();
  const updateInfo = await sweetsCollections.updateOne(
    { _id: ObjectId(sweetId) },
    { $addToSet: { replies: replyObj } }
  );
  if (updateInfo.modifiedCount == 0)
    throw `Could not reply sweet with id of ${sweetId}`;
  else return await get(sweetId);
}

async function deleteReply(sweetId, replyId, userThatDeletedReply) {
  sweetId = validation.checkId(sweetId, 'sweetId');
  replyId = validation.checkId(replyId, 'replyId');
  const sweetsCollections = await sweets();
  const sweet = await get(sweetId);
  const replyArr = sweet.replies;
  let found = false;
  for (let i = 0; i < replyArr.length; i++) {
    const reply = replyArr[i];
    if (reply._id.toString() == replyId) {
      if (
        reply.userThatPostedReply._id.toString() != userThatDeletedReply.userId
      )
        throw `you cannot delete a reply that is not belong to you!`;
      found = true;
      break;
    }
  }
  if (!found) throw `there is no reply with ${replyId}!`;
  const updateInfo = await sweetsCollections.updateOne(
    { _id: ObjectId(sweetId) },
    { $pull: { replies: { _id: ObjectId(replyId) } } }
  );
  if (updateInfo.modifiedCount == 0)
    throw `Could not delete reply with replyId of ${replyId}`;
  else return await get(sweetId);
}

async function like(sweetId, userThatLikes) {
  sweetId = validation.checkId(sweetId, 'sweetId');
  const sweetsCollections = await sweets();
  const sweet = await get(sweetId);
  const likesArr = sweet.likes;
  const userId = userThatLikes.userId;
  for (let i = 0; i < likesArr.length; i++)
    likesArr[i] = likesArr[i].toString();
  let updateInfo;
  if (likesArr.includes(userId)) {
    updateInfo = await sweetsCollections.updateOne(
      { _id: ObjectId(sweetId) },
      { $pull: { likes: ObjectId(userId) } }
    );
  } else {
    updateInfo = await sweetsCollections.updateOne(
      { _id: ObjectId(sweetId) },
      { $addToSet: { likes: ObjectId(userId) } }
    );
  }
  if (updateInfo.modifiedCount == 0)
    throw `Could not like or unlike with sweetId of ${sweetId}`;
  else return await get(sweetId);
}

module.exports = {
  create,
  getFifty,
  get,
  patch,
  reply,
  deleteReply,
  like,
};
