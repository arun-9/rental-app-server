import { APIGatewayProxyHandler } from 'aws-lambda';

export const optionsPreflightManagers: APIGatewayProxyHandler = async () => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'OPTIONS, POST',
    },
    body: '',
  };
};
