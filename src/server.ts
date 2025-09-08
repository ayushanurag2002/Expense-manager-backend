import 'dotenv/config';
import app from './app';
import  connectDB  from './loaders/mongoose';
import logger from './utils/logger';

const PORT = Number(process.env.PORT) || 8080;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      logger.info(`API listening on http://0.0.0.0:${PORT}`);
    });
  } catch (err) {
    logger.error({ err, msg: 'Server failed to start' });
    process.exit(1);
  }
};

startServer();
