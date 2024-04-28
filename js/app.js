let session = new Session();
session = session.getSession();

if(session !== '')
{
    window.location.href = 'hexa.html';
}

document.querySelector('.no-acc-register #registracija').addEventListener('click', () => {
    document.querySelector('.custom-modal').style.display = 'block';
})

document.querySelector('.custom-modal #closeModal').addEventListener('click', () => {
    document.querySelector('.custom-modal').style.display = 'none';
})

validator1 = new Validator(config, '#registrationForm');

document.querySelector('#registrationForm').addEventListener('submit', e => {
    e.preventDefault();

    if(validator1.validationPassed())
    {
        user = new User();
        user.username = document.querySelector('#korisnicko_ime').value;
        user.email = document.querySelector('#email').value;
        user.password = document.querySelector('#lozinka').value;
        user.create();
    }
    else
    {
        alert('Polja nisu dobro popunjena');
    }
})

document.querySelector('#loginForm').addEventListener('submit', e => {
    e.preventDefault();
    console.log('nesto');
    let email = document.querySelector('#login_email').value;
    let password = document.querySelector('#login_password').value;
    let user = new User();
    user.email = email;
    user.password = password;
    user.login();
})