import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as io from '@actions/io'

export async function executeAzCliCommand(command: string, silent?: boolean): Promise<void> {
  try {
    const azPath = await io.which('az', true)
    const commandLine = `"${azPath}" ${command}`
    core.info(`azPath: ${azPath} commandLine: ${commandLine}`)

    await exec.exec(commandLine, [], {
      silent: !!silent
      // listeners: {
      //   stdout: (data) => {
      //     myOutput += data.toString();
      //   },
      //   stderr: (data) => {
      //     myError += data.toString();
      //   },
      // },
    })
  } catch (error) {
    throw new Error(error)
  }
}
