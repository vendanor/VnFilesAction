import * as core from '@actions/core'
import {Md5} from 'ts-md5/dist/md5'
import {loginAzure} from './az-login'
import {executeAzCliCommand} from './az-run-command'
import {logoutAzure} from './az-logout'

async function run(): Promise<void> {
  try {
    core.info('🎈🎈 Running Vendanor upload file action 🎈🎈')

    const token = core.getInput('azure-token', {required: true})
    const salt = core.getInput('salt', {required: true})
    const inputFilename = core.getInput('input', {required: true})
    const append = core.getInput('append-md5-hash')
    const accountName = core.getInput('azure-account-name', {required: true})
    const targetFolder = core.getInput('folder')

    const md5 = new Md5()
    md5.appendStr(salt)
    md5.appendStr(inputFilename)
    const md5val = md5.end(false)
    let targetFilename: string

    if (append) {
      const parts = inputFilename.split('.')
      if (parts.length === 2) {
        targetFilename = `${targetFolder}${parts[0]}_${md5val}.${parts[1]}`
      } else {
        targetFilename = `${targetFolder}${inputFilename}_${md5val}`
      }
    } else {
      targetFilename = `${targetFolder}${inputFilename}`
    }

    const cmd = `storage blob upload --account-name ${accountName} --container-name $web --file ${inputFilename} --name ${targetFilename}`

    core.info(`Target filename: ${targetFilename}`)
    core.info(`AZ cmd: ${cmd}`)

    await loginAzure(token)
    await executeAzCliCommand(cmd)
    await logoutAzure()

    const url = `https://files.vendanor.com/${targetFilename}`;
    core.setOutput('filename', targetFilename)
    core.setOutput('url', url)
    core.info(`🔥 Url: ${url}`)

    core.info('🍿🍿🍿 GREAT SUCCESS - very nice 🍿🍿🍿')
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
