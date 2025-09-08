type LogData = { msg: string; err?: unknown };

const logger = {
  info: (msg: string) => console.log(`ℹ️  ${msg}`),
  warn: (msg: string) => console.warn(`⚠️  ${msg}`),
  error: (data: LogData | string) => {
    if (typeof data === 'string') {
      console.error(`❌ ${data}`);
    } else {
      console.error(`❌ ${data.msg}`, data.err);
    }
  },
};

export default logger;
