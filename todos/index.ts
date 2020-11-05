import { APIGatewayProxyHandlerV2, APIGatewayProxyEventV2 } from 'aws-lambda'
import { TodoClient } from './client'
import { Todo } from './types'
import { v4 as uuidv4 } from 'uuid'

export const getTodos: APIGatewayProxyHandlerV2 = async () => {
  try {
    const data = await TodoClient.scan().exec()

    return {
      statusCode: 200,
      body: JSON.stringify(data.toJSON()),
    }
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify(e),
    }
  }
}

export const createTodo: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2,
) => {
  try {
    const { body } =
      typeof event.body === 'string'
        ? JSON.parse(event.body ?? '{}')
        : event.body

    const newTodo = new TodoClient({
      id: uuidv4(),
      completed: false,
      body,
    })

    const data = await newTodo.save().then((data) => data.toJSON() as Todo)

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  } catch (e) {
    console.log('error', e)
    return {
      statusCode: 400,
      body: JSON.stringify(e),
    }
  }
}

export const deleteTodo: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2,
) => {
  try {
    const id = String(event.pathParameters?.id)
    await TodoClient.delete({ id })

    return {
      statusCode: 200,
      body: id,
    }
  } catch (e) {
    console.log('error', e)
    return {
      statusCode: 400,
      body: JSON.stringify(e),
    }
  }
}

export const completeTodo: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2,
) => {
  try {
    const id = String(event.pathParameters?.id)
    const data = await TodoClient.update({ id }, { completed: true })

    return {
      statusCode: 200,
      body: JSON.stringify(data.toJSON()),
    }
  } catch (e) {
    console.log('error', e)
    return {
      statusCode: 400,
      body: JSON.stringify(e),
    }
  }
}
