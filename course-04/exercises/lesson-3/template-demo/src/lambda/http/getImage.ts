import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import * as AWS from 'aws-sdk'

const docClient = new AWS.DynamoDB.DocumentClient()
const imagesTable = process.env.IMAGES_TABLE
const imageIdIndex = process.env.IMAGE_ID_INDEX

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) : Promise<APIGatewayProxyResult> => {

    const imageId = event.pathParameters.imageId

    const result = await docClient.query({
        TableName: imagesTable,
        IndexName: imageIdIndex,
        KeyConditionExpression: 'imageId = :imageId',
        ExpressionAttributeValues: {
            ':imageId': imageId
        }
    }).promise();

    if( result.Count !== 1){
        return {
            statusCode: 404,
            headers:{
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                'message': 'No image found ;('
            })
        }
    }

    return {
        statusCode: 200,
        headers:{
            'Access-Control-Allow-Origin': '*'
        },
        body:JSON.stringify({
            item: result.Items[0]
        })
    }                                    
}