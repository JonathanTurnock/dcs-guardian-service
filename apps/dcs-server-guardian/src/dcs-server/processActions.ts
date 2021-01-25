import { spawn } from 'child_process';
import { pathExistsSync } from 'fs-extra';

const tasklist = require('tasklist'); // eslint-disable-line @typescript-eslint/no-var-requires
const taskkill = require('taskkill'); // eslint-disable-line @typescript-eslint/no-var-requires

const DCS_PROCESS_NAME = 'DCS.exe';

export type TaskActionResult<RESULTS, DATA> = {
  resultInfo: RESULTS;
  result: boolean;
  data?: DATA;
};

export type ProcessInfo = {
  imageName: string;
  pid: number;
  sessionName: string;
  sessionNumber: number;
  memUsage: number;
};

export const getDcsProcess = async (): Promise<ProcessInfo | undefined> => {
  const processes = await tasklist();
  return processes.find(({ imageName }) => imageName === DCS_PROCESS_NAME);
};

export const startDcs = async (
  launcher,
): Promise<TaskActionResult<'STARTED' | 'RUNNING', ProcessInfo>> => {
  const process = await getDcsProcess();
  if (process) {
    return {
      result: false,
      resultInfo: 'RUNNING',
      data: process,
    };
  }

  if (!pathExistsSync(launcher)) {
    throw new Error(`Failed to launch, ${launcher} does not exist`);
  }

  const child = spawn(launcher, {
    detached: true,
    stdio: ['ignore', 'ignore', 'ignore'],
  });
  child.unref();

  return {
    resultInfo: 'STARTED',
    result: true,
  };
};

export const stopDcs = async (): Promise<
  TaskActionResult<'STOPPED' | 'NOT_RUNNING', void>
> => {
  const process = await getDcsProcess();
  if (!process) {
    return {
      result: false,
      resultInfo: 'NOT_RUNNING',
    };
  }
  taskkill(process.pid, { force: true });
  return {
    resultInfo: 'STOPPED',
    result: true,
  };
};
