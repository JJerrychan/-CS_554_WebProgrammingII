const sweetsRoutes = require('./sweets');

const constructorMethod = (app) => {
  app.use('/sweets', sweetsRoutes);

  app.use('*', async (req, res) => {
    res.status(404).json({ error: 'Page Not found!' });
  });
};

module.exports = constructorMethod;
