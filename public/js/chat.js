const socket = io()
//element selector
const sendMessageSelector = document.querySelector("#sendb")
const sendLocationSelector = document.querySelector("#send-location")
const  message = document.querySelector("#message");
const messages = document.querySelector("#messages");
const sidebar = document.querySelector("#sidebar")

//template selector
const messageTemplate         = document.querySelector("#message-template").innerHTML;
const locationmessageTemplate =  document.querySelector("#locationmessage-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

//option 
const { username,room } = Qs.parse(location.search,{ignoreQueryPrefix:true})

socket.on('userJoinedRoom',({room,users})=>{
    const html = Mustache.render(sidebarTemplate,{
        room: room,
        users:users
    })
    sidebar.innerHTML = html
})
socket.on('messageFound',(messageData)=>{
    const html = Mustache.render(messageTemplate,{
        username:messageData.username,
        message:messageData.text,
        createdAt:  moment(messageData.createdAt).format('hh:mm a') 
    })
    messages.insertAdjacentHTML('beforeend',html)
   
})
socket.on('locationmessageFound',(message)=>{
    const html = Mustache.render(locationmessageTemplate,{
        username:message.username,
        url:message.url,
        createdAt:  moment(message.createdAt).format('hh:mm a') 
    })
    messages.insertAdjacentHTML('beforeend',html)
    
})
sendMessageSelector.addEventListener('click',(e)=>{
    e.preventDefault();
    sendMessageSelector.setAttribute('disabled','disabled');
 socket.emit('message',message.value,(err)=>{
    if(err){
        return alert(err)
    }
    message.value = ''
    message.focus()
    sendMessageSelector.removeAttribute('disabled')
 });

})

sendLocationSelector.addEventListener('click',()=>{
    
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('locationMessage',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        })
    })
})

/* sendLocationSelector.addEventListener('click',()=>{
    if(!navigator.geolocation)
    {
        return alert('Geolocation is not supported ');
    }
    sendLocationSelector.setAttribute('disabled','disabled');

    navigator.geolocation.getCurrentPosition((position)=>{
        
        socket.emit('locationMessage',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },(message)=>{
            console.log(message);
            sendLocationSelector.removeAttribute('disabled');
        });
    })
}) */

socket.emit('join',{username,room},(err)=>{
     if(err){
         alert(err)
         location.href="/"
     }
})