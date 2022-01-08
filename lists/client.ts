import dynamoose from 'dynamoose'

dynamoose.aws.sdk.config.update({
  region: 'us-east-1',
})

if (process.env.IS_OFFLINE) {
  dynamoose.aws.ddb.local('http://localhost:8001')
}

const listSchema = new dynamoose.Schema(
  {
    id: {
      type: String,
      hashKey: true,
    },
    body: String,
    category: {
      type: String,
      index: {
        name: 'category-index',
        global: true,
      },
    },
  },
  { timestamps: true }
)

const ListClient = dynamoose.model('Lists', listSchema, { create: false })

export { ListClient }
