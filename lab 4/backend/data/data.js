const axios = require('axios');
const utils = require('../public/utils');

const redisClient = require('../config/redisConnetion').redisClient;

async function getCharactersById(id) {
  id = utils.checkString(id);
  const rGet = await redisClient.get(`chara${id}`);
  if (rGet) {
    return JSON.parse(rGet);
  } else {
    const url = utils.generateUrl(`characters/${id}`);
    const { data } = await axios.get(url).catch((error) => {
      throw `there is no character with id:${id}`;
    });
    const result = data.data.results[0];
    await redisClient.set(`chara${id}`, JSON.stringify(result));
    return result;
  }
}

async function getCharactersByPage(page) {
  page = utils.checkPage(page);
  const rGet = await redisClient.get(`charapage${page}`);
  if (rGet) {
    return JSON.parse(rGet);
  } else {
    const offst = (page - 1) * 20;
    let url = utils.generateUrl(`characters`);
    url = url + '&offset=' + offst;
    const { data } = await axios.get(url).catch((error) => {
      throw `there is no Characters with page:${page}`;
    });
    const result = data.data;
    await redisClient.set(`charapage${page}`, JSON.stringify(result));
    return result;
  }
}

async function getComicsByPage(page) {
  page = utils.checkPage(page);
  const rGet = await redisClient.get(`comicpage${page}`);
  if (rGet) {
    return JSON.parse(rGet);
  } else {
    const offst = (page - 1) * 20;
    let url = utils.generateUrl(`comics`);
    url = url + '&offset=' + offst;
    const { data } = await axios.get(url).catch((error) => {
      throw `there is no comics with page:${page}`;
    });
    const result = data.data;
    await redisClient.set(`comicpage${page}`, JSON.stringify(result));
    return result;
  }
}

async function getStoriesByPage(page) {
  page = utils.checkPage(page);
  const rGet = await redisClient.get(`storypage${page}`);
  if (rGet) {
    return JSON.parse(rGet);
  } else {
    const offst = (page - 1) * 20;
    let url = utils.generateUrl(`stories`);
    url = url + '&offset=' + offst;
    const { data } = await axios.get(url).catch((error) => {
      throw `there is no stories with page:${page}`;
    });
    const result = data.data;
    await redisClient.set(`storypage${page}`, JSON.stringify(result));
    return result;
  }
}

async function getComicsById(id) {
  id = utils.checkString(id);
  const rGet = await redisClient.get(`comic${id}`);
  if (rGet) return JSON.parse(rGet);
  else {
    const url = utils.generateUrl(`comics/${id}`);
    const { data } = await axios.get(url).catch((error) => {
      throw `there is no comics with id:${id}`;
    });
    const result = data.data.results[0];
    await redisClient.set(`comic${id}`, JSON.stringify(result));
    return result;
  }
}

async function getStoriesById(id) {
  id = utils.checkString(id);
  const rGet = await redisClient.get(`story${id}`);
  if (rGet) return JSON.parse(rGet);
  else {
    const url = utils.generateUrl(`stories/${id}`);
    const { data } = await axios.get(url).catch((error) => {
      throw `there is no stories with id:${id}`;
    });
    const result = data.data.results[0];
    await redisClient.set(`story${id}`, JSON.stringify(result));
    return result;
  }
}

async function getCharactersHistory() {
  let hisList = await redisClient.LRANGE('charactersHistory', 0, 19);
  for (let i = 0; i < hisList.length; i++) {
    hisList[i] = await getCharactersById(hisList[i]);
  }
  return hisList;
}

module.exports = {
  getCharactersById,
  getComicsById,
  getStoriesById,
  getCharactersHistory,
  getCharactersByPage,
  getComicsByPage,
  getStoriesByPage,
};
