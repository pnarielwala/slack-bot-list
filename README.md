# slack-bot-list
## Goal
The goal of this repo is to be a boilerplate for anyone who would like to deploy a simple slack list bot to AWS and set it up with Slack

## What you'll need
Before you get started, make sure you have access to the following

* [Nodejs](https://formulae.brew.sh/formula/node)
* [Yarn](https://formulae.brew.sh/formula/yarn)
* [AWS Account](https://signin.aws.amazon.com/) (~ $2.60/month)
* [Serverless Account](https://app.serverless.com/) (FREE)

## Get started

### Install dependencies

Ensure your `node` version is `v14.x` or above

```sh
$ yarn install
```

### Initialize Serverless

After you create your Serverless account, with the command below you'll be asked to login

```sh
$ yarn serverless
```

### Install local Dynamodb database

> You may need to install Java SE8 for local dynamodb to work

```sh
$ yarn serverless dynamodb install
```

### Spin up local server with a fresh database
```sh
$ yarn start
```

## Setup with Slack
### AWS Credentials
Follow this [great serverless article](https://www.serverless.com/framework/docs/providers/aws/guide/credentials/) to help you get your AWS credentials

### Deploy with Serverless

All you need to do now is to deploy with serverless, and it handles the rest! Database and lambdas will be created for you and you'll get API endpoints!
```sh
$ yarn serverless deploy
```

### Slack

Now the fun part!

Now that you have an endpoint, we'll now create a Slack App. First you will go to https://api.slack.com/apps/ and click on `Create New App` select "From an app manifest". It's in beta but should work just fine.

Copy and paste the below manifest into the step where it asks for it. (Be sure to fill in the missing data)

```json
{
    "_metadata": {
        "major_version": 1,
        "minor_version": 1
    },
    "display_information": {
        "name": "Lists"
    },
    "features": {
        "bot_user": {
            "display_name": "MyBot",
            "always_online": false
        },
        "slash_commands": [
            {
                "command": "/list",
                "url": "<YOUR_NEW_ENDPOINT_HERE>",
                "description": "Create list of items (todos, topics, etc)",
                "usage_hint": "help",
                "should_escape": false
            }
        ]
    },
    "oauth_config": {
        "scopes": {
            "bot": [
                "commands"
            ]
        }
    },
    "settings": {
        "org_deploy_enabled": false,
        "socket_mode_enabled": false,
        "token_rotation_enabled": false
    }
}
```
Once the app is created, all that is left is to install the app into your workspace (should be prompted for this after wizard).

## All Done!

Now you should be able to go into any channel and send the following message:
```
/list show
```
:partying_face::partying_face::partying_face:
