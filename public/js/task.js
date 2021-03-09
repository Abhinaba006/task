var completed = function(id){
    return console.log('a')
    var body = {
        completed:true
    }
    fetch('/update/'+id , {
        method: 'patch',
        body,
        completed:true
    }).then((response)=>{
        var com = document.getElementById(id+'completed')
        com.innerHTML = 'true'
        com.style.color = 'red'
    }).catch()
}
console.log('working')