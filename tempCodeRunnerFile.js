db.collection('tasks').find({completed:false}).toArray((error, tasks)=>{
    //     console.log(tasks)
    // })