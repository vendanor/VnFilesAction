# files-action

Action to upload files (for internal use by Vendanor)

## Usage

```yaml
- name: Upload some file
  id: mystep
  uses: vendanor/VnFilesAction
  with:
    azureToken: ${{ secrets.AZURE_TOKEN }}
    salt: ${{ secrets.SALT }}
    input: myfile.json
    folder: 'subfolder/'
```

## Code in Main

Install the dependencies
```bash
$ npm install
```

Build the typescript and package it for distribution
```bash
$ npm run build && npm run package
```

## Publish to a distribution branch

Actions are run from GitHub repos so we will checkin the packed dist folder.

Then run [ncc](https://github.com/zeit/ncc) and push the results:
```bash
$ npm run package
$ git add dist
$ git commit -a -m "prod dependencies"
$ git push origin releases/v1
```

Note: We recommend using the `--license` option for ncc, which will create a license file for all of the production node modules used in your project.

Your action is now published! :rocket:

See the [versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)
