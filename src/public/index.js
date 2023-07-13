let chatBox = document.getElementById("chatBox")

Swal.fire({
    title: 'Authentication',
    input: 'text',
    text: 'Set username for the cat',
    inputValidator: value => {
        return !value.trim() && "Please write a valid username"
    },
    allowOutsideClick: false
  }).then(result => {
    const socket = io()
    user = result.value
    document.getElementById("user").innerHTML = user

    chatBox.addEventListener("keyup", evt => {
        // console.log(evt.key)
        if(evt.key === "Enter") {
            if(chatBox.value.trim().length > 0) {
                socket.emit("message", {
                    user,
                    message: chatBox.value
                })
                chatBox.value = ""
            }
        }
    })
    
    socket.on("history", data => {
        let history = document.getElementById("history")
        let messages = ""
        data.reverse().forEach(message => {
            messages += `<p>${message.user} dice: ${message.message}<br/></p>`
        })
        history.innerHTML = messages
        chatBox.value = ""
    })

    socket.on("alert", () => {
        alert("Nuevo usuario conectado...")
    })
})


    