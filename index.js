const express = require('express');
const AWS = require('aws-sdk');
const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const verify = require('./router/verifyToken');

const app = express();
const server = http.createServer(app);
app.use(express.json());

//connect to db
mongoose.connect(process.env.MONGO_URL,{
    useCreateIndex:true,
    useNewUrlParser:true,
    ignoreUndefined:true,
    useUnifiedTopology:true
},()=>console.log('Connected to db'))


//middleware
app.use(express.json());

//import routes
const authRoute = require('./routes/auth')

//dynamicDB
AWS.config.region = 'ap-south-1';
const dynamoDb=new AWS.DynamoDB.DocumentClient()

//read data
app.get('/photos',verify,async(req,res)=>{
    const params = {
        TableName: 'users'
    }
    dynamoDb.scan(params, (error, result) => {
        if (error) {
          res.status(400).json({ error: 'Error retrieving users'});
        }
        else{
            res.status(200).json(result)
        }
      })
})

//add data
app.post('/photos',verify, (req, res) => {
    const { photo} = req.body;
  
    const userId = uuid.v4();
  
    const params = {
      TableName: 'users',
      Item: {
        email_Id,
        photo:req.file.media,
      },
    };
  
    dynamoDb.put(params,verify, (error) => {
      if (error) {
        console.log('Error creating user: ', error);
        res.status(400).json({ error: 'Could not create User data' });
      }
  
      res.json({ email_Id, photo });
    });
  });

//update
  app.put('/photos',verify, (req, res) => {
    const { email_Id, photo } = req.body;
  
    var params = {
      TableName : 'users',
      Key: { email_Id },
      UpdateExpression : 'set #a = :photo',
      ExpressionAttributeNames: { '#a' : 'photo' },
      ExpressionAttributeValues : { ':photo' : photo },
    };
  
    dynamoDb.update(params, (error) => {
      if (error) {
        console.log(`Error updating user with id ${email_Id}: `, error);
        res.status(400).json({ error: 'Could not update user photo' });
      }
  
      res.json({email_Id,photo });
    })
  });
  
  //delete
  app.delete('/photo/:emaiil_Id', (req, res) => {
    const { email_Id } = req.params;
  
    const params = {
      TableName: 'users',
      Key: {
        email_Id,
      },
    };
  
    dynamoDb.delete(params, (error) => {
      if (error) {
        console.log(`Error updating user with id ${todoId}`, error);
        res.status(400).json({ error: 'Could not delete photos' });
      }
  
      res.json({ success: true });
    });
  });

  
server.listen(8080,()=>console.log(`http://localhost:${8080}`));