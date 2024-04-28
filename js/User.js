class User{
    user_id = '';
    username = '';
    email = '';
    password='';
    api_url = 'https://66202d013bf790e070af3570.mockapi.io';

    create(){
        let data = {
            username: this.username,
            email: this.email,
            password: this.password
        }
        data = JSON.stringify(data);
        fetch(this.api_url + '/users',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body:data
        })
        .then(response => response.json())
        .then(data => {
            let session = new Session();
            session.user_id = data.id;
            session.startSession();
            window.location.href = 'hexa.html';
        })
    }

    login(){
        fetch(this.api_url + "/users")   
        .then(response => response.json())
        .then(data => {
            let login_successful = 0;
            data.forEach(db_user => {
                if(db_user.email === this.email && db_user.password === this.password){
                    login_successful = 1;
                    let session = new Session();
                    session.user_id = db_user.id;
                    session.startSession();
                    window.location.href = 'hexa.html'; 
                }
            });

            if(login_successful === 0)
            {
                alert('Pogresan email ili lozinka!');
            }
        });
    }

    async get(user_id){
        let api_url = this.api_url + '/users/' + user_id;
        
        let response = await fetch(api_url);

        let data = await response.json();

        return data;
    }

    delete(user_id){
        fetch(this.api_url + '/users/' + user_id,{
            method: 'DELETE'
        }).then(response => response.json())
        .then(data => {
            window.location.href = 'index.html';
            let session = new Session();
            session.destroySession();
        });
    }
}