import * as core from '@actions/core'

import {FormatType, SecretParser} from 'actions-secret-parser'
import {executeAzCliCommand} from './az-run-command'

/**
 * Mostly copy-paste from here: https://github.com/Azure/login/blob/master/src/main.ts
 * @param token
 */
export async function loginAzure(token: string): Promise<void> {
  try {
    const prefix = process.env.AZURE_HTTP_USER_AGENT ? `${process.env.AZURE_HTTP_USER_AGENT}` : ''
    const azPSHostEnv = process.env.AZUREPS_HOST_ENVIRONMENT ? `${process.env.AZUREPS_HOST_ENVIRONMENT}` : ''

    const usrAgentRepo = `${process.env.GITHUB_REPOSITORY}`
    const actionName = 'AzureLogin'
    const userAgentString = `${prefix ? `${prefix}+` : ''}GITHUBACTIONS/${actionName}@v1_${usrAgentRepo}`

    const azurePSHostEnv = `${azPSHostEnv ? `${azPSHostEnv}+` : ''}GITHUBACTIONS/${actionName}@v1_${usrAgentRepo}`

    core.exportVariable('AZURE_HTTP_USER_AGENT', userAgentString)
    core.exportVariable('AZUREPS_HOST_ENVIRONMENT', azurePSHostEnv)

    await executeAzCliCommand('--version')
    const secrets = new SecretParser(token, FormatType.JSON)
    const servicePrincipalId = secrets.getSecret('$.clientId', false)
    const servicePrincipalKey = secrets.getSecret('$.clientSecret', true)
    const tenantId = secrets.getSecret('$.tenantId', false)
    const subscriptionId = secrets.getSecret('$.subscriptionId', false)
    if (!servicePrincipalId || !servicePrincipalKey || !tenantId || !subscriptionId) {
      throw new Error(
        'Not all values are present in the azure credentials object. Ensure clientId, clientSecret, tenantId and subscriptionId are supplied.'
      )
    }

    await executeAzCliCommand(
      `login --service-principal -u "${servicePrincipalId}" -p "${servicePrincipalKey}" --tenant "${tenantId}"`,
      true
    )
    await executeAzCliCommand(`account set --subscription "${subscriptionId}"`, true)

    core.info('🙌 Login to azure - Great success! 🙌')
  } catch (error) {
    core.error('Login to azure failed 🎃')
    throw new Error(error)
  }
}
