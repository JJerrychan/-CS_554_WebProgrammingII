const usersData = require('../data/users');
const sweetsData = require('../data/sweets');
const express = require('express');
const router = express.Router();
const validation = require('../data/validation');

router.get('/', async (req, res) => {
  let page = req.query.page ? req.query.page - 1 : 0;
  try {
    if (!Number.isInteger(page) || page < 0)
      throw `page must be an positive Integer!`;
  } catch (e) {
    return res.status(400).json({ error: e });
  }
  try {
    const fifty = await sweetsData.getFifty(page);
    res.json(fifty);
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

router.post('/', async (req, res) => {
  if (!req.session.AuthCookie)
    return res.status(401).json({ error: 'you have to log in first!' });
  let sweetPostData = req.body;
  try {
    if (!sweetPostData.sweetText || !sweetPostData.sweetMood)
      throw 'all arguments must hava valid values!';
    sweetPostData.sweetText = validation.checkString(
      sweetPostData.sweetText,
      'sweetText'
    );
    sweetPostData.sweetMood = validation.checkString(
      sweetPostData.sweetMood,
      'sweetMood'
    );
    sweetPostData.sweetMood = validation.checkMood(sweetPostData.sweetMood);
  } catch (e) {
    return res.status(400).json({ error: e });
  }
  try {
    const { sweetText, sweetMood } = sweetPostData;
    res.json(
      await sweetsData.create(sweetText, sweetMood, req.session.AuthCookie)
    );
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.patch('/:id', async (req, res) => {
  if (!req.session.AuthCookie)
    return res.status(401).json({ error: 'you have to log in first!' });
  let sweetText = req.body.sweetText;
  let sweetMood = req.body.sweetMood;
  try {
    req.params.id = validation.checkId(req.params.id, 'Id URL Param');
    if (!sweetText && !sweetMood)
      throw 'at least one argument must hava valid value!';
    if (sweetText) sweetText = validation.checkString(sweetText, 'sweetText');
    if (sweetMood) {
      sweetMood = validation.checkString(sweetMood, 'sweetMood');
      sweetMood = validation.checkMood(sweetMood);
    }
  } catch (e) {
    return res.status(400).json({ error: e });
  }
  try {
    res.json(
      await sweetsData.patch(
        req.params.id,
        sweetText,
        sweetMood,
        req.session.AuthCookie
      )
    );
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.post('/signup', async (req, res) => {
  try {
    let name = req.body.name;
    let username = req.body.username;
    let password = req.body.password;
    if (!name || !username || !password)
      throw 'name, username and password must be supplied!';
    name = validation.checkString(name, 'name');
    username = username.trim().toLowerCase();
    password = password.trim();
    if (username.length < 4)
      throw 'length of username must at least 4 charaters!';
    if (password.search(' ') != -1)
      throw 'it must not contain any spaces in password!';
    if (password.length < 6)
      throw 'length of password must at least 6 charaters!';
    let dbReturn = await usersData.createUser(name, username, password);
    if (dbReturn) res.json(dbReturn);
    else res.status(500).json({ error: 'Internal Server Error' });
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

router.post('/login', async (req, res) => {
  try {
    let username = req.body.username;
    let password = req.body.password;
    if (!username || !password) throw 'username and password must be supplied!';
    username = username.trim().toLowerCase();
    password = password.trim();
    if (username.length < 4)
      throw 'length of username must at least 4 charaters!';
    if (password.search(' ') != -1)
      throw 'it must not contain any spaces in password!';
    if (password.length < 6)
      throw 'length of password must at least 6 charaters!';
    let dbReturn = await usersData.checkUser(username, password);
    if (dbReturn) {
      req.session.AuthCookie = { userId: dbReturn.userId, username: username };
      res.json({ name: dbReturn.name, username: dbReturn.username });
    } else res.status(500).json({ error: 'Internal Server Error' });
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

router.get('/logout', async (req, res) => {
  req.session.destroy();
  res.json({ msg: 'you have been logged out!' });
});

router.get('/:id', async (req, res) => {
  try {
    req.params.id = validation.checkId(req.params.id, 'Id URL Param');
  } catch (e) {
    return res.status(400).json({ error: e });
  }
  try {
    const sweet = await sweetsData.get(req.params.id);
    res.json(sweet);
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

router.post('/:id/replies', async (req, res) => {
  if (!req.session.AuthCookie)
    return res.status(401).json({ error: 'you have to log in first!' });
  try {
    req.body.reply = validation.checkString(req.body.reply, 'reply');
    req.params.id = validation.checkId(req.params.id, 'Id URL Param');
  } catch (e) {
    return res.status(400).json({ error: e });
  }
  try {
    const sweet = await sweetsData.reply(
      req.params.id,
      req.session.AuthCookie,
      req.body.reply
    );
    res.json(sweet);
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

router.delete('/:sweetId/:replyId', async (req, res) => {
  if (!req.session.AuthCookie)
    return res.status(401).json({ error: 'you have to log in first!' });
  try {
    req.params.sweetId = validation.checkId(
      req.params.sweetId,
      'sweetId URL Param'
    );
    req.params.replyId = validation.checkId(
      req.params.replyId,
      'replyId URL Param'
    );
  } catch (e) {
    return res.status(400).json({ error: e });
  }
  try {
    const sweet = await sweetsData.deleteReply(
      req.params.sweetId,
      req.params.replyId,
      req.session.AuthCookie
    );
    res.json(sweet);
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

router.post('/:id/likes', async (req, res) => {
  if (!req.session.AuthCookie)
    return res.status(401).json({ error: 'you have to log in first!' });
  try {
    req.params.id = validation.checkId(req.params.id, 'Id URL Param');
  } catch (e) {
    return res.status(400).json({ error: e });
  }
  try {
    const sweet = await sweetsData.like(req.params.id, req.session.AuthCookie);
    res.json(sweet);
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

module.exports = router;
