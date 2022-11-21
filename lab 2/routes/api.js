const express = require('express');
const router = express.Router();
const data = require('../data/data');
const utils = require('../public/utils');
const redisClient = require('../config/redisConnetion').redisClient;

router.get('/characters/history', async (req, res) => {
  try {
    res.json(await data.getCharactersHistory());
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.get('/characters/:id', async (req, res) => {
  try {
    req.params.id = utils.checkString(req.params.id);
  } catch (e) {
    res.status(404).json({ error: e });
  }
  try {
    res.json(await data.getCharactersById(req.params.id));
    await redisClient.LPUSH('charactersHistory', req.params.id);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.get('/comics/:id', async (req, res) => {
  try {
    req.params.id = utils.checkString(req.params.id);
  } catch (e) {
    res.status(404).json({ error: e });
  }
  try {
    res.json(await data.getComicsById(req.params.id));
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.get('/stories/:id', async (req, res) => {
  try {
    req.params.id = utils.checkString(req.params.id);
  } catch (e) {
    res.status(404).json({ error: e });
  }
  try {
    res.json(await data.getStoriesById(req.params.id));
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

module.exports = router;
