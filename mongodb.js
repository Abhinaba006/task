//crud create read update delete

// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient
// const ObjectID = mongodb.ObjectID

const { MongoClient, ObjectID } = require('mongodb')

const  connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

// const id = new ObjectID();  
// console.log(id.toHexString().length)
// console.log(id.getTimestamp())

MongoClient.connect(connectionURL, {
    useUnifiedTopology: true
}, (error, client )=>{
    if(error){
        return console.log(error)
    }

    console.log('connected correctly')
    const db = client.db(databaseName)

    // db.collection('user').updateOne({
    //     _id:new ObjectID('602787775e534e35ec2970f9')
    // }, {
    //     $inc:{
    //         age: -1
    //     }
    // }).then((result) => {
    //     console.log(result)
    // }).catch((err) => {
    //     console.log
    // });

    // db.collection('tasks').updateMany({
    //     completed:false
    // },{
    //     $set:{
    //         completed:true
    //     }
    // }).then((result)=>{
    //     console.log(result.modifiedCount)
    // }).catch((err)=>{
    //     console.log(err)
    // })

    db.collection('user').deleteMany({
        age:22
    }).then((result)=>{
        console.log(result)
    }).catch((err)=>{
        console.log(err)
    })

})