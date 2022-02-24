const socket=io()

const $rooms=document.querySelector("#room-list")



socket.on("rooms",(rooms)=>{
    console.log(rooms);
    rooms.forEach((room)=>{
        $rooms.insertAdjacentHTML("beforeend",`<option value="${room}">${room}</option>`)

    })

})