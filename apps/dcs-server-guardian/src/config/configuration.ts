import { resolve } from 'path';
import { existsSync } from 'fs';

export default () => {
  if (!process.env.DCS_LAUNCHER) {
    throw new Error(
      'Please Define dcs launcher path as an environment variable named DCS_LAUNCHER!',
    );
  }
  const launcher = resolve(process.env.DCS_LAUNCHER);

  if (!existsSync(launcher)) {
    throw new Error(`DCS Launcher does not exist at ${launcher}`);
  }

  return {
    dcsServer: {
      basePath: 'http://localhost:8088',
      launcher,
    },
  };
};
