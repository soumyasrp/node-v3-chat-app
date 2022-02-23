const socket=io() 
const $messageForm=document.querySelector("#message-form")
const $messageFormInput=$messageForm.querySelector("input")
const $messageFormButtton=$messageForm.querySelector("button")
const $sendlocationButton=document.querySelector("#send-location")
const $messages=document.querySelector("#messages")


// Templates

const messageTemplate=document.querySelector("#message-template").innerHTML
const locationMessageTemplate=document.querySelector("#location-message-template").innerHTML
const sidebarTemplate=document.querySelector("#sidebar-template").innerHTML


//Options
const {username,room} = Qs.parse(location.search,{ignoreQueryPrefix: true})

const autoscroll=()=>{
    
    // New Message
    const $newMessage=$messages.lastElementChild

    //Height of the last message
    const newMessageStyles=getComputedStyle($newMessage)
    const newMessageMargin=parseInt(newMessageStyles.marginBottom)
    const newMessageHeight=$newMessage.offsetHeight+newMessageMargin

    // Visible Height
    const visibleHeight=$messages.offsetHeight

    //Height of message container
    const containerHeight=$messages.scrollHeight

    //How far have i scrolled?
    const scrollOffset=$messages.scrollTop+visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset){
        $messages.scrollTop=$messages.scrollHeight
    }

}

socket.on("message",(message)=>{
    console.log(message);
    
    const html=Mustache.render(messageTemplate,{
        username:message.username,
        message:message.text,
        createdAt:moment(message.createdAt).format("h:mm a")
    })
    $messages.insertAdjacentHTML("beforeend",html)
    autoscroll()
})



socket.on("locationMessage",(message)=>{
    console.log(message);
    const html=Mustache.render(locationMessageTemplate,{
        username:message.username,
        url:message.url,
        createdAt:moment(message.createdAt).format("h:mm a")

    })
    $messages.insertAdjacentHTML("beforeend",html)
    autoscroll()
})

socket.on("roomData",({room,users})=>{
    console.log(room);
    console.log(users);

    const html=Mustache.render(sidebarTemplate,{
        room,users
    })
    document.querySelector("#sidebar").innerHTML=html
})

$messageForm.addEventListener("submit",(e)=>{
    e.preventDefault()

    $messageFormButtton.setAttribute("disabled","disabled")
    //disable
    const message=e.target.elements.message.value
    socket.emit("sendMessage",message,(error)=>{
        $messageFormButtton.removeAttribute("disabled")
        $messageFormInput.value=""
        $messageFormInput.focus()
        //enable
        if(error){
            return console.log(error);
        }
        console.log("Message delivered");
    })
})

$sendlocationButton.addEventListener("click",()=>{
    if(!navigator.geolocation){
        return alert("Geoloction is not supported by your browser")
    }
    $sendlocationButton.setAttribute("disabled","disabled")
    navigator.geolocation.getCurrentPosition((position)=>{
       socket.emit("sendLocation",{
           latitude:position.coords.latitude,
           longitude:position.coords.longitude
           
       },()=>{
           $sendlocationButton.removeAttribute("disabled")
           console.log("Location Shared!");
       })
    })
})

socket.emit("join",{username,room},(error)=>{
    if(error){
        alert(error)
        location.href="/"
    }
})