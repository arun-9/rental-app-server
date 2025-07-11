import { APIGatewayProxyHandler } from "aws-lambda";
import { connectToDb } from "../db/connection";
import { getManagerModel } from "../db/models/Manager";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
};

export const handler: APIGatewayProxyHandler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: "",
    };
  }

  try {
    const cognitoId = event.pathParameters?.cognitoId;
    
    // ✅ Log for debugging
    console.log("🧠 [Lambda] Incoming Cognito ID:", cognitoId);

    if (!cognitoId) {
       console.log("🚫 Manager not found for ID:", cognitoId); // extra debug
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: "Missing cognitoId in path." }),
      };
    }

    const sequelize = await connectToDb();
    const Manager = await getManagerModel(sequelize);

    const manager = await Manager.findOne({ where: { cognitoId } });

    if (!manager) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ message: "Manager not found." }),
      };
    }
    // ✅ Log found manager (optional)
    console.log("✅ Found Manager:", manager.toJSON());

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(manager.toJSON()),
    };
  } catch (error: any) {
    console.error("❌ Error fetching manager:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ message: `Error fetching manager: ${error.message}` }),
    };
  }
};
