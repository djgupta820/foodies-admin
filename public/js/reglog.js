const login = document.querySelector('#login')
const register = document.querySelector('#register')

function createMessage(data, parentElemet, messageType){
    const div = document.createElement('div')
    div.className = 'message-' + messageType
    const text = document.createTextNode(data)
    div.append(text)
    parentElemet.parentNode.insertBefore(div, parentElemet)
    setTimeout(()=>{
        parentElemet.parentNode.removeChild(div)
    }, 3000)
}

if(login){
    login.addEventListener('submit', (e)=>{
        e.preventDefault()
        const username = login['username'].value
        const password = login['password'].value
        if(username === ''){
            createMessage("Please input username!", login, 'danger')
        }
        else if(password === ''){
            createMessage("Please input password!", login, 'danger')
        }
        else{
            login.submit()
        }
    })
}

if(register){
    function validateEmail(){
        
    }
    register.addEventListener('submit', (e)=>{
        e.preventDefault()
        const name = register['name'].value
        const email = register['email'].value
        const phone = register['phone'].value
        const address = register['address'].value
        const password = register['password'].value
        if(name.length <= 3){
            createMessage("Name must have more than 3 characters!", register, 'danger')
        }
        else if(email.length <= 0){
            createMessage("Please input your email!", register, 'danger')
        }
        else if(phone.length < 10 || phone.length > 10){
            createMessage("Phone number must be 10 digits long!", register, 'danger')
        }
        else if(address.length <= 0){
            createMessage("Please input your address!", register, 'danger')
        }
        else if(password.length < 8 || password.length > 15){
            createMessage("Password length must be between 8 and 15 characters!", register, 'danger')
        }
        else{
            register.submit()
        }
    })
}