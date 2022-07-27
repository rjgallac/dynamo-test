'use strict';
const AWS = require("aws-sdk");
const {v4} = require("uuid");

module.exports.hello = async (event) => {
  
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  // const  { testItem } = JSON.parse(event.body);
  const testItem = "tesTItem"
  const createdAt = new Date();
  const id = v4();
  const newItem = {
    id,
    testItem,
    createdAt,
    completed: false
  }

  await dynamodb.put({
    TableName: "TestTable",
    Item: newItem
  }).promise();
  
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v3.0! Your function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  };
};

module.exports.hello2 = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();

  const id = event.id;
  console.log(id)

  const data = await dynamodb.delete({ 
    TableName: "TestTable", 
    Key: { id: id }
  }, function(err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data);
    }
  }).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'hello2!',
        input: event,
      },
      null,
      2
    ),
  };
};

module.exports.hello3 = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();

  const id = event.id;
  console.log(id)

  const data = await dynamodb.scan({ TableName: "TestTable"}).promise();
  for(let i=0;i < data.Items.length; i++){
    if(data.Items[i].completed ===false) {
      console.log("item",data.Items[i])
      await deleteItem(dynamodb, data.Items[i]);
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'hello2!',
        input: event,
      },
      null,
      2
    ),
  };
};

function deleteItem(dynamodb, item){
  const itemid = item.id;
  console.log(itemid)
  return dynamodb.delete({ 
    TableName: "TestTable", 
    Key: { id: itemid }
  }, function(err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data);
    }
  }).promise();
}