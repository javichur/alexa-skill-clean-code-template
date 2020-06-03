# alexa-skill-clean-code-template

(Updated to v2 ask-cli)

<https://github.com/javichur/alexa-skill-clean-code-template>

Alexa Skill Template with clean code (eslint, sonar), testing (unit tests, e2e), multi-language, Alexa Presentation Language (APL), In-Skill Purchases support (ISP) and more.

Made with ❤️ by Javier Campos (<https://javiercampos.es>)
Available on the [AWS Serverless Application Repository].

## Available intents

- [x] Load and save info from/to session (LoadSessionIntent, SaveSessionIntent).
- [x] Load and save data from/to Dynamodb (LoadDynamoDBIntent, SaveDynamoDBIntent).
- [x] Using external APIs (UseApiIntent).
- [x] Get user info like name, email or phone (CheckPermisionsIntent).
- [x] Using built-in slots (ColorIntent).
- [x] APL touch support (ListadoItemSelected).
- [x] In-Skill Purchases: Subscriptions and One-Time purchases (WhatCanIBuyIntent, TellMeMoreAboutProductIntent, BuyIntent, PurchaseHistoryIntent, RefundProductIntent; BuyResponseHandler and CancelProductResponseHandler).
- [x] FallbackIntent to respond gracefully to unexpected customer requests (AMAZON.FallbackIntent).
- [x] Chaining intents sample (ChainingIntent).
- [x] Dynamic entities / slots (UpdateJokeCategoriesIntent, ClearDynamicEntitiesIntent).
- [x] And more...

## Initial Setup

1. Install ASK CLI (`npm install -g ask-cli`)

2. For Windows users, please fix Powershell problem once (more info <https://github.com/alexa/ask-cli/blob/develop/docs/FAQ.md#q-for-windows-users-if-your-skill-return-empty-response-and-log-shows-module-not-found-genericerrormapper-or-cannot-find-module-dispatchererrormappergenericerrormapper-how-to-resolve>):

```shell
Install-Module Microsoft.PowerShell.Archive -MinimumVersion 1.2.3.0 -Repository PSGallery -Force -Scope CurrentUser
```

3. Install Visual Code (<https://code.visualstudio.com/)>

4. (Do not use this vscode extension with ask-cli v2) ~~Install Alexa Skill Kit (ASK) Toolkit for vscode (<https://marketplace.visualstudio.com/items?itemName=ask-toolkit.alexa-skills-kit-toolkit>)~~

5. You must edit ~/.aws/credentials file to add a valid AWS profile (aws_access_key_id, aws_secret_access_key) with the following policy. You must create a IAM user with this policy (<https://console.aws.amazon.com/iam/>):

```json
{
  "Version": "2012-10-17",
  "Statement": {
    "Effect": "Allow",
    "Action": [
      "iam:CreateRole",
      "iam:GetRole",
      "iam:AttachRolePolicy",
      "iam:PassRole",
      "lambda:AddPermission",
      "lambda:CreateFunction",
      "lambda:GetFunction",
      "lambda:UpdateFunctionCode",
      "lambda:ListFunctions",
      "lambda:UpdateFunctionConfiguration",
      "logs:FilterLogEvents",
      "logs:getLogEvents",
      "logs:describeLogStreams"
    ],
    "Resource": "*"
  }
}
```

More info:

- <https://developer.amazon.com/es/docs/smapi/manage-credentials-with-ask-cli.html>
- <https://docs.aws.amazon.com/es_es/cli/latest/userguide/cli-chap-configure.html>

## How to create a new Alexa Skill using this template

1. Configure ASK CLI with AWS profile (credentials):

```shell
ask configure
```

*(The old `ask init` command has been removed in ask-cli v2).*

2. Create a new skill from this template (<https://github.com/javichur/alexa-skill-clean-code-template>):

```shell
ask new --template-url https://github.com/javichur/alexa-skill-clean-code-template.git --template-branch master
? Choose a method to host your skill's backend resources:  AWS Lambda
? Would you like to continue download the skill template?  Yes
? Please type in your skill name:  my-new-skill
? Please type in your folder name for the skill project (alphanumeric):  my-new-skill
Project for skill "my-new-skill" is successfully created at \my-new-skill

Project initialized with deploy delegate "@ask-cli/lambda-deployer" successfully.
```

*(The old command `ask new --url` has been removed in ask-cli v2).*

3. Select your AWS region and nodejs version in `ask-resources.json` file.

4. Install dependencies:

```shell
cd my-new-skill/lambda/custom
npm install
```

5. Develop your awesome Alexa Skill! Take advantage of this template!

6. Deploy the skill easily with cli:

```shell
cd my-new-skill
ask deploy
```

7. Test your skill:

```shell
ask dialog -l en-US
> open <your invocation name>
```

## How to take advantage of this template

1. Deploy the skill easily with cli:

```shell
ask deploy
```

2. Multi-language. Add text strings for all languages in `strings` folder.

3. Handlers organized in the `/handlers` folder to quickly find the samples:
API calls, chaining intents, APL touch events, dynamic entities, dynamoDB, session,
in skill purchases (ISP), get user permissions, other global handlers...

4. Control your Code Style using Airbnb eslint rules:

  ```shell
  npm run eslint
  ```

5. Control the quality of your code using SonarQube (I assume Sonar running on localhost:9000):

```shell
npm run sonar
start http://localhost:9000/dashboard?id=my-new-skill
```

6. Use vscode and press `F5` to start Unit Tests and **debug with breakpoints in your code**.

Or use `npm run unit-test`

7. Run e2e tests. Use `npm run e2e-test`. You must get a free access token for a virtual device in <https://apps.bespoken.io/dashboard/virtualdevice> and paste it in `testing.json` file.

## How this template was created from Amazon-provided "Hello world" template

1. Configure ASK CLI with AWS profile (credentials):

```shell
ask configure
```

You must edit ~/.aws/credentials file to add a valid AWS profile (aws_access_key_id, aws_secret_access_key, region). More info: <https://docs.aws.amazon.com/es_es/cli/latest/userguide/cli-chap-configure.html>

2. Create a new skill from `Hello World` template (<https://github.com/alexa/skill-sample-nodejs-hello-world>):

```shell
ask new
? Please select the runtime Node.js V8
? List of templates you can choose Hello World
? Please type in your skill name:  alexa-skill-clean-code-template
```

The `.ask/config` file will be contain:

```json
{
  "deploy_settings": {
    "default": {
      "skill_id": "",
      "was_cloned": false,
      "merge": {}
    }
  }
}
```

3. Edit `skill.json` to deploy Lambda function in Europe:

```json
"apis": {
  "custom": {
    "endpoint": {
      "sourceDir": "lambda/custom",
      "uri": "ask-custom-clean-code-skill-template-default"
    },
    "regions": {
      "EU": {
        "endpoint": {
          "sourceDir": "lambda/custom",
          "uri": "ask-custom-clean-code-skill-template-default"
        }
      }
    }
  }
}
```

4. Deploy

```shell
ask deploy
```

Or deploy only Lambda function

```shell
ask deploy lambda
```

The `ask deploy` command invokes hooks in order to install dependencies.

5. Test interaction model using `Utterance Profiler` (<https://developer.amazon.com/alexa/console/ask>)

6. Test your skill using **interactive** `ask dialog`

```shell
ask dialog --locale "en-US"
User  >  start hello world
Alexa >  Welcome to the Alexa Skills Kit, you can say hello!
User  >  help
Alexa >  You can say hello to me!
User  >  hello
Alexa >  Hello World!
```

7. Test your skill using simulator (<https://developer.amazon.com/alexa/console/ask>)

8. (Removed in ASK-CLI V2) Test JSON request/response using `ask simulate`

```shell
(Removed) ask simulate --locale "en-US" --text "start hello world"
```

9. Automating Unit Tests using Bespoken Tools. `.vscode/launch.json` edited.

```shell
npm install bespoken-tools --save-dev
```

And press `F5` to start Unit Tests. Or use `npm run unit-test`

10. Clean code. ESLINT (with airbnb rules) + Sonar added. See root package.json

```shell
npm run eslint
npm run sonar-eslint
```

11. Locale. Add `addRequestInterceptors()` interceptor.

12. Add text strings for all languages in `strings` folder.

13. Add `es-ES` language in `skill.json`.

14. Refactor handlers. See `/handlers/globalHandlers.js`.

15. `IntentReflectorHandler` added.

16. Add APL support in Skill Manifest (<https://developer.amazon.com/es/docs/alexa-presentation-language/apl-select-the-viewport-profiles-your-skill-supports.html>).

```json
"interfaces": [
  {
    "type": "ALEXA_PRESENTATION_APL",
    "supportedViewports": [
      {
        "mode": "HUB",
        "shape": "ROUND",
        "minWidth": 480,
        "maxWidth": 480,
        "minHeight": 480,
        "maxHeight": 480
      },
      {
        "mode": "HUB",
        "shape": "RECTANGLE",
        "minWidth": 1024,
        "maxWidth": 1024,
        "minHeight": 600,
        "maxHeight": 600
      },
      {
        "mode": "HUB",
        "shape": "RECTANGLE",
        "minWidth": 1280,
        "maxWidth": 1280,
        "minHeight": 800,
        "maxHeight": 800
      },
      {
        "mode": "TV",
        "shape": "RECTANGLE",
        "minWidth": 960,
        "maxWidth": 960,
        "minHeight": 540,
        "maxHeight": 540
      },
      {
        "mode": "HUB",
        "shape": "RECTANGLE",
        "minWidth": 960,
        "maxWidth": 960,
        "minHeight": 480,
        "maxHeight": 480
      }
    ]
  }
],
```

17. Add APL templates `/apl`.

18. Use APL with custom layoyts (`VerticalListItem` in `documentListado.json`).

19. Use APL events (`headerNavigationAction` and `TouchWrapper.onPress` in `documentListado.json`).

20. Access to DynamoDB using dynamola library.

```shell
npm install dynamola --save
```

Use it:

```javascript
const Dynamola = require('dynamola');
let myDb = new Dynamola('dynamodb-table-name', 'dynamodb-primary-key-name', null);

myDb.getItem(userID).then((data) => {
  if(!data){
      // item doesn't exist
  }
  else {
    // item returned OK
  }
})
.catch((err) => {
  // error reading dynamodb
});
```

To access the DynamoDB database:
I. Configure the name of the table and the name of the primary key in the "settings.js" file.
II. Verify that you have created the database in dynamodb.
III. You can create a test table using the `dynamodb-create-sample-table.js` script. You will need access permissions to DynamoDB where you run that script.
IV. Verify that you have assigned the necessary permissions for the lambda function to get read/write access to the dynamodb table. Get more info here: `https://github.com/javichur/dynamola`

21. Work with session. See `/data/sessionState.js`, and following intents: `SaveSessionIntent` and `LoadSessionIntent`.

22. Access to external APIs. Check `/data/api.js` and `UseApiRequestHandler` (`index.js`).

23. Mock info `/data/mocks`.

24. Tests e2e added. Use `npm run e2e-test`. You must get a free access token for a virtual device in <https://apps.bespoken.io/dashboard/virtualdevice> and paste it in `testing.json` file.

25. Deploy using Alias and Lambda versions.
// TODO

26. Use permissions to get info about the user (name, phone number or email).
Add the following code in `skill.json` and try `CheckPermisionsIntent` sample.

```json
"permissions": [
  {
    "name": "alexa::profile:given_name:read"
  },
  {
    "name": "alexa::profile:email:read"
  },
  {
    "name": "alexa::profile:mobile_number:read"
  }
]
```

27. In-Skill Purchases added. Check `\handlers\purchaseHandlers.js`, `index.js` and voice models. New intents have been included: WhatCanIBuyIntent, TellMeMoreAboutProductIntent, BuyIntent, PurchaseHistoryIntent, RefundProductIntent; BuyResponseHandler and CancelProductResponseHandler.

## Known problems

1. Error invoking `ask deploy`: "No se puede cargar el archivo `\hooks\pre_deploy_hook.ps1` porque la ejecución de scripts está deshabilitada en este sistema". Solution:

```shell
Set-ExecutionPolicy -Scope CurrentUser
$> unrestricted
```

**IMPORTANT**: If you create a new skill project from a skill template that contains hook scripts, ASK CLI will run them. You should only use skill templates from sources that you trust.

## Useful commands

ASK CLI v1 to v2 Migration Guide:
<https://developer.amazon.com/es-ES/docs/alexa/smapi/ask-cli-v1-to-v2-migration-guide.html>

Check ask-cli version:

```shell
ask -v
```

Add testers to a beta test for the given Alexa skill:

```shell
ask smapi add-testers-to-beta-test -s <skill-id> --testers-emails <testers-emails-separated-by-commas>
```

Test your alexa skill:

```shell
ask dialog -l en-US
```

For Windows users, please fix the PowerShell problem once if your skill return empty response, and log shows "Module not found: GenericErrorMapper" or "Cannot find module './dispatcher/error/mapper/GenericErrorMapper'" (more info <https://github.com/alexa/ask-cli/blob/develop/docs/FAQ.md#q-for-windows-users-if-your-skill-return-empty-response-and-log-shows-module-not-found-genericerrormapper-or-cannot-find-module-dispatchererrormappergenericerrormapper-how-to-resolve>):

```shell
Install-Module Microsoft.PowerShell.Archive -MinimumVersion 1.2.3.0 -Repository PSGallery -Force -Scope CurrentUser
```
