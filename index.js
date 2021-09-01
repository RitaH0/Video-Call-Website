

function validate(){
    let email=document.getElementById('idEmail').value;
    let password=document.getElementById('idPassword').value;

    if (email.match(/\S+@\S+\.\S+/)){
        email.className=''
        if (password.length >=8){
            password.className=''
            return true
        }
        else{
            alert('Password needs to be at least 8 characters')
            password.className='incorrect'
            return false
        }
    }
    else{
        alert('Please enter a valid email ')
        email.className='incorrect'
        return false
    }

};

