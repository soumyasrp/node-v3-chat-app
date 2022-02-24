const users=[]

const addUser=({id,username,room})=>{
    //clean the data
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()

    //validate the data
    if(!username || !room){
        return {
            error:"username and room are required!!"
        }
    }

    // check for existing user
    const existingUser=users.find((user)=>{
        return user.room===room && user.username===username

    })

    //validate Username
    if(existingUser){
        return {
            error:"Username is in use!"
        }
    }

    //Store User
    const user={id,username,room}
    users.push(user)
    return{ user }

}

const RemoveUser=(id)=>{
    const index=users.findIndex((user)=>{
        return user.id===id
    })
    if(index!==-1){
        return users.splice(index,1)[0]
    }
}

const getUser = (id) =>{
    return users.find((user) =>  user.id === id)
}


const getUsersInRoom=(room)=>{
    room=room.trim().toLowerCase()
    return users.filter((user) => user.room===room )
}

const getRoom=()=>{
    let rooms=[]
    users.forEach((o)=>{
        if(!rooms.includes(o.room)){
            rooms.push(o.room)
        }
    })
    return rooms;
}



module.exports={
    addUser,RemoveUser,getUser,getUsersInRoom,getRoom
}

