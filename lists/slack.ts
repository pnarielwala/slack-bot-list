import { APIGatewayProxyHandlerV2, APIGatewayProxyEventV2 } from 'aws-lambda'
import { ListClient } from './client'
import {
  AddCommand,
  ClearCommand,
  Command,
  RemoveCommand,
  ShowCommand,
  ListItem,
} from './types'
import { v4 as uuidv4 } from 'uuid'

import querystring from 'querystring'

const COMMANDS_LIST = `
 show <LIST_NAME> <string>
 add <LIST_NAME> <string>
 remove <LIST_NAME> <index>
 clear <LIST_NAME>
 help`

const parseText = (text: string): Command => {
  /**
   * /list show <LIST_NAME> <string>
   * /list add <LIST_NAME> <string>
   * /list remove <LIST_NAME> <index>
   * /list clear <LIST_NAME>
   */

  const splitText = text.trim().split(' ')
  const method = splitText[0]
  const list = splitText[1]
  const input = splitText.slice(2).join(' ')

  switch (method) {
    case 'show':
      return {
        method,
        list,
      }
    case 'add':
      return {
        method,
        list,
        body: input,
      }
    case 'remove':
      return {
        method,
        list,
        index: +input,
      }
    case 'clear':
      return {
        method,
        list,
      }
    case 'help':
      return {
        method: 'help',
        output: `Here are a list of available commands:${COMMANDS_LIST}`,
      }
    default:
      return {
        method: 'help',
        output: `Invalid command/syntax. Here are a list of available commands:${COMMANDS_LIST}`,
      }
  }
}

const showList = async (command: ShowCommand) => {
  const data = await ListClient.query('category').eq(command.list).exec()
  const items = (data.toJSON() as ListItem[]).sort((a, b) => {
    return a.createdAt > b.createdAt ? 1 : -1
  })

  const outputItemsText =
    items.map((todo) => `- ${todo.body}`).join('\n') || ` No items to show.`

  return `${command.list}\n${outputItemsText}`
}

const addListItem = async (command: AddCommand) => {
  const newItem = new ListClient({
    id: uuidv4(),
    completed: false,
    body: command.body,
    category: command.list,
  })

  await newItem.save().then((data) => data.toJSON() as ListItem)

  return await showList({ method: 'show', list: command.list })
}

const removeListItem = async (command: RemoveCommand) => {
  const data = await ListClient.query('category').eq(command.list).exec()
  const items = data.sort((a, b) => {
    return a.createdAt > b.createdAt ? 1 : -1
  })

  const todoToRemove = items[command.index]

  if (todoToRemove) {
    await todoToRemove.delete()
  }

  return showList({ method: 'show', list: command.list })
}

const clearList = async (command: ClearCommand) => {
  const data = await ListClient.query('category').eq(command.list).exec()
  await Promise.all(data.map((item) => item.delete()))

  return `${command.list} CLEARED!`
}

export const hook: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  /*
    Sample event:
    ?token=gIkuvaNzQIHg97ATvDxqgjtO
    &team_id=T0001
    &team_domain=example
    &enterprise_id=E0001
    &enterprise_name=Globular%20Construct%20Inc
    &channel_id=C2147483705
    &channel_name=test
    &user_id=U2147483697
    &user_name=Steve
    &command=/weather
    &text=94070
    &response_url=https://hooks.slack.com/commands/1234/5678
    &trigger_id=13345224609.738474920.8088930838d88f008e0
    &api_app_id=A123456
  */
  try {
    const text = String(querystring.parse(String(event.body)).text)

    const command = parseText(text)

    let output
    switch (command.method) {
      case 'show':
        output = await showList(command)

        return {
          statusCode: 200,
          body: JSON.stringify({
            response_type: 'in_channel',
            text: output,
          }),
        }
      case 'add':
        output = await addListItem(command)

        return {
          statusCode: 200,
          body: JSON.stringify({
            response_type: 'in_channel',
            text: output,
          }),
        }
      case 'remove':
        output = await removeListItem(command)

        return {
          statusCode: 200,
          body: JSON.stringify({
            response_type: 'in_channel',
            text: output,
          }),
        }

      case 'clear':
        output = await clearList(command)

        return {
          statusCode: 200,
          body: JSON.stringify({
            response_type: 'in_channel',
            text: output,
          }),
        }
      default:
        return {
          statusCode: 200,
          body: JSON.stringify({
            response_type: 'in_channel',
            text: command.output,
          }),
        }
    }
  } catch (e) {
    console.log('error', e)
    return {
      statusCode: 400,
      body: JSON.stringify(e),
    }
  }
}
