import dynamoose from 'dynamoose'

dynamoose.aws.sdk.config.update({
  region: 'us-east-1',
})

if (process.env.IS_OFFLINE) {
  dynamoose.aws.ddb.local('http://localhost:8001')
}

const todoSchema = new dynamoose.Schema(
  {
    id: {
      type: String,
      hashKey: true,
    },
    body: String,
    completed: Boolean,
  },
  { timestamps: true },
)

const TodoClient = dynamoose.model('Todos', todoSchema, { create: false })

export { TodoClient }
