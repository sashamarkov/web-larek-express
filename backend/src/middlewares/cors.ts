import cors from 'cors';
import config from '../config';

export default cors({
  origin: config.originAllow,
  credentials: true,
});
