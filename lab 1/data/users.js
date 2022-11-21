const bcrypt = require('bcrypt');
const saltRounds = 16;
const users = require('../config/mongoCollections').users;
const validation = require('./validation');

async function createUser(name, username, password) {
  if (!name || !username || !password)
    throw 'name, username and password must be supplied!';
  name = validation.checkString(name, 'name');
  if (typeof username != 'string' || typeof password != 'string')
    throw 'username and password must be a string!';
  username = username.trim().toLowerCase();
  if (username.length < 4)
    throw 'length of username must at least 4 charaters!';
  const usersCollections = await users();
  const user = await usersCollections.findOne({ username: username });
  if (user) throw 'the username already exists!';
  password = password.trim();
  if (password.search(' ') != -1)
    throw 'it must not contain any spaces in password!';
  if (password.length < 6)
    throw 'length of password must at least 6 charaters!';
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const newUser = {
    name: name,
    username: username,
    password: passwordHash,
  };
  const insertInfo = await usersCollections.insertOne(newUser);
  if (insertInfo.insertedCount == 0) throw 'user create failed!';
  else return { name: name, username: username };
}

async function checkUser(username, password) {
  if (!username || !password) throw 'username and password must be supplied!';
  if (typeof username != 'string' || typeof password != 'string')
    throw 'username and password must be a string!';
  username = username.trim().toLowerCase();
  if (username.length < 4)
    throw 'length of username must at least 4 charaters!';
  const usersCollections = await users();
  const user = await usersCollections.findOne({ username: username });
  if (!user) throw 'Either the username or password is invalid';
  password = password.trim();
  if (password.search(' ') != -1)
    throw 'it must not contain any spaces in password!';
  if (password.length < 6)
    throw 'length of password must at least 6 charaters!';
  const compare = await bcrypt.compare(password, user.password);
  if (!compare) throw 'Either the username or password is invalid';
  else
    return { name: user.name, username: username, userId: user._id.toString() };
}

module.exports = {
  createUser,
  checkUser,
};
