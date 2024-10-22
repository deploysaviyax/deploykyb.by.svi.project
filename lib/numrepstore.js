const { MongoClient } = require('mongodb');
const fs = require('fs-extra');
const { isDecimal } = require('./functions'); 
const config = require('../config');
const { format } = require('path');

let msg = [];
let databaseName = 'Saviya_movie_data'
let collectionName = 'number_reply_data'
let client= null;
const uri = config.MONGODB_URI;

const mongodb_connection_start = async () => {
  try {
      const clientmongo = new MongoClient(uri);
      await clientmongo.connect();
      console.log('Connected to MongoDB');
      client =  clientmongo;
      return true;
  } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      client = null;
      throw error;
  }
}

const start_numrep_process = async()=>{
  try {
    const mongodb = await mongodb_connection_start();
    if(mongodb === true){
      if(client ===null){
        throw 'You can\'t pass mongodb client befor initialize it, so run mongodb_connection_start function first!! if you already did it please double check your mongodb uri.';
      }else{
      await add_old_data_to_msg_array_retrive_from_mongodb_when_start();
      }
    }else{
      throw mongodb;
    }
  } catch (error) {
    
  }

}
const add_old_data_to_msg_array_retrive_from_mongodb_when_start = async () => {
  try {
    if (client === null) {
      throw 'You can\'t pass mongodb client before initializing it, so run mongodb_connection_start function first!! if you already did it please double check your mongodb uri.';
    } else {
      const db = client.db(databaseName);
      const collection = db.collection(collectionName);

      const oldData = await collection.find().toArray();

      oldData.forEach(data => {
        const { remoteJid, id } = data.key;
        if (!msg[remoteJid]) {
          msg[remoteJid] = [];
        }
        msg[remoteJid][id] = {
          key: data.key,
          numrep: data.numrep,
          method: data.method,
          _id: data._id
        };
      });

      return true;
    }
  } catch (error) {
    console.error('Error retrieving old data from MongoDB:', error);
    throw error;
  }
}

  
  const upload_to_mongodb = async (data,databaseName,collectionName) => {
      try {
        if(client ===null){
          throw 'You can\'t pass mongodb client befor initialize it, so run mongodb_connection_start function first!! if you already did it please double check your mongodb uri.';
        }else{
          const db = client.db(databaseName);
          const collection = db.collection(collectionName);
  
          await collection.insertOne(data);
  
          return true;
        }
      } catch (error) {
          console.error('Error uploading data to MongoDB:', error);
          throw error;
      }
  }
  
  const get_data_from_mongodb = async (databaseName,collectionName) => {
    try { if(client ===null){
      throw 'You can\'t pass mongodb client befor initialize it, so run mongodb_connection_start function first!! if you already did it please double check your mongodb uri.';
    }else{
        const db = client.db( databaseName);
        const collection = db.collection(collectionName);

        const data = await collection.find().toArray();

        return data;
    }
    } catch (error) {
        console.error('Error retrieving data from MongoDB:', error);
        throw error;
    }
}

  const storenumrepdata = async (json) => {
      try {
        if(client ===null){
          throw 'You can\'t pass mongodb client befor initialize it, so run mongodb_connection_start function first!! if you already did it please double check your mongodb uri.';
        }else{
          if (!msg[json?.key?.remoteJid]) {
              msg[json?.key?.remoteJid] = [];
          }
          msg[json?.key?.remoteJid][json.key?.id] = json;
  
          const db = client.db(databaseName);
          const collection = db.collection(collectionName);
  
          await collection.insertOne(json);
  
          return msg[json?.key?.remoteJid][json.key?.id];
        }
      } catch (error) {
          console.error('Error storing data in MongoDB:', error);
          throw error;
      }
  };

const getstorednumrep = async (quotedid, jid, num,conn,mek) => {
    
  if (!msg[jid]) return false;
  if (!msg[jid][quotedid]) return false;
   if (msg[jid][quotedid]?.key?.fromMe === false) return false;

  const storedMsg = msg[jid][quotedid];
  const numrep = storedMsg.numrep;
  const method = storedMsg?.method
          
  const from = storedMsg?.key?.remoteJid
  if(method === 'nondecimal' || method === undefined || method === null){
  if (!isNaN(num) &&  parseInt(num) > 0 && parseInt(num) <= numrep.length) {
     
      return numrep[parseInt(num) - 1];
  } else {
      await conn.sendMsg(from,{text : 'Please enter a valid number!!'}, {quoted:mek})
      return null; 
  }
}else if(method === 'decimal'){
if(isDecimal(parseFloat(num))){
let nummers = num.split('.')
num = parseInt(nummers[0])+'.'+parseInt(nummers[1])
  function getValue(decimal) {
      let result = null; 
    
      numrep.forEach(item => { 
        if (item.startsWith(decimal)) {
          const args = item.trim().split(/ +/).slice(1); 
          result = args.join(' '); 
        }
      });
    
      return result; 
    }
    const found = getValue(num)
  if (found !== null) {
      return found;
  } else {
      await conn.sendMsg(from,{text : 'Please enter a valid number!!'}, {quoted:mek})
      return null; 
  }
}
}
};

module.exports = {
    mongodb_connection_start,
    start_numrep_process,
    upload_to_mongodb,
    get_data_from_mongodb,
    storenumrepdata,
    getstorednumrep
};
