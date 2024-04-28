let session = new Session();
session_id = session.getSession();

if(session_id !== "") {
    async function populateUserData(){
        let user = new User();
        user = await user.get(session_id);

        document.querySelector('#username').innerText = user.username;
        document.querySelector('#email').innerText = user.email;

        document.querySelector('#korisnicko_ime').value = user.username;
        document.querySelector('#edit_email').value = user.email;
    }

    populateUserData()

} else {
    window.location.href = "/";
    alert('Ne radi');
}

document.querySelector('#logout').addEventListener('click', () =>{
    session.destroySession();
    window.location.href = 'index.html';
})

document.querySelector('#editAccount').addEventListener('click', () => {
    document.querySelector('.custom-modal').style.display = 'block';
})

document.querySelector('#closeModal').addEventListener('click', () => {
    document.querySelector('.custom-modal').style.display = 'none';
})

document.querySelector('#editForm').addEventListener('submit', e => {
    e.preventDefault();

    let user = new User();
    user.username = document.querySelector('#korisnicko_ime').value;
    user.email = document.querySelector('#edit_email').value;
    user.edit();
});

document.querySelector('#deleteProfile').addEventListener('click', async  e =>{
    e.preventDefault();

    let text = 'Da li ste sigurni da zaista zelite da obrisete profil?';

    if(confirm(text) === true)
    {
        let user = new User();
        let post = new Post();
        data = await post.getAllPosts();
        data.forEach(element => {
            if(element.user_id === session.getSession())
            {
                post.delete(element.id);
            }
        })
        user.delete(session.getSession());
    }
})

document.querySelector('#postForm').addEventListener('submit', e =>{
    e.preventDefault();

    async function createPost(){
        let content = document.querySelector('#postContent').value;
        if(content === '')
        {
            alert('You need to type something!');
        }
        else{
            document.querySelector('#postContent').value = '';
            let post = new Post();
            post.post_content = content;
            post = await post.create();

            let current_user = new User();
            current_user = await current_user.get(session_id);

            let delete_post_html = '';

            if(session_id === post.user_id){
                delete_post_html = '<button class="remove-btn" onclick="removeMyPosts(this)">Remove</button>';
            }

            document.querySelector('#allPostsWrapper').innerHTML += `<div class='single-post' data-post_id='${post.id}'>
                                                          <div class='post-content'>${post.content}</div>
                                                          <div class="post-actions">
        <p><b>Autor:</b> ${current_user.username}</p>
        <div>
        <button onclick="likePost(this)" class="likePostJS like-btn"><span>${post.likes}</span> Likes</button>
        ${delete_post_html}
        </div>

      </div>`;
        }
    }

    createPost();
})

async function getAllPosts() {
    let all_posts = new Post();
  
    all_posts = await all_posts.getAllPosts();
  
    all_posts.forEach((post) => {
      async function getPostUser() {
        let user = new User();
        user = await user.get(post.user_id);
  
        let html = document.querySelector("#allPostsWrapper").innerHTML;
  
        let delete_post_html = "";

        if(session_id === post.user_id)
        {
            delete_post_html = '<button class="remove-btn" onclick="removeMyPosts(this)">Remove</button>';
            
        }
        document.querySelector("#allPostsWrapper").innerHTML =
            `<div class='single-post' data-post_id='${post.id}'>
                <div class='post-content'>${post.content}</div>
      
                <div class="post-actions">
                  <p><b>Autor:</b> ${user.username}</p>
                  <div>
                  <button onclick="likePost(this)" class="likePostJS like-btn"><span>${post.likes}</span> Likes</button>
                  ${delete_post_html}
                  </div>
      
                </div>    
                </div>` + html;
      }
      getPostUser();
    })
}

getAllPosts();



const removeMyPosts = btn =>{
    let post_id = btn.closest('.single-post').getAttribute('data-post_id');

    btn.closest('.single-post').remove();

    let post = new Post();
    post.delete(post_id);
}

const likePost = btn =>{
    let post_id = btn.closest('.single-post').getAttribute('data-post_id');
    let main_post_el = btn.closest('.single-post');
    let number_of_likes = parseInt(btn.querySelector('span').innerText)

    btn.querySelector('span').innerText = number_of_likes + 1;
    btn.disabled = true;

    let post = new Post();
    post.like(post_id, number_of_likes + 1);
}