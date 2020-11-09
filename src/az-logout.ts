import {executeAzCliCommand} from './az-run-command'

export const logoutAzure = async (): Promise<void> => {
  await executeAzCliCommand('logout')
}
