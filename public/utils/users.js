const users =[];
const addUser = ({id,username,room})=>{
   username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()
    if(!username || !room){
        
        return {
            error: 'username or room is required'
        }
        
    }

   let userexist = users.find((user)=>user.username === username && user.room === room)
    
    if(userexist){
        return {
            error: 'username is taken!'
        }
    }
    user = {
        id,username,room
    }
    users.push(user)
    return {user};
}
const removeUser =(id)=>{
const index = users.findIndex((user)=>user.id === id)

if(index!== -1){
    return users.splice(index,1)[0]
    
}

}

const getUser = (id)=>{
    const findUser = users.find((user)=>{
        return user.id === id
    })
    return findUser
}

const getUsersInRoom = (room)=>{
    
    const filterusers = users.filter((user)=>user.room === room)
    return filterusers
}



module.exports = {
    addUser,removeUser,getUser,getUsersInRoom
}


