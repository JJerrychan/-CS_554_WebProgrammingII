const apiRoutes = require('./api');

const constructorMethod = (app) => {
  app.use('/api', apiRoutes);

  app.use('*', async (req, res) => {
    res.status(404).json({ error: 'Page Not found!' });
  });
};

module.exports = constructorMethod;
