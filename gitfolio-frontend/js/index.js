const store = {
  users: [],
  repositories: []
};

function init() {
  User.renderUsers()
}

function clipBoard(e) {
  let codeText = document.querySelector(`#${e.target.id}-code-hidden`);
  codeText.select();
  
  try { //it's good practice to put execCommands in try catch blocks
  document.execCommand('copy');
  } catch (err) {
    window.alert('Oops, unable to copy');
  }
  
}

function cleanStore(array, element) {
  return array.filter(e => e.userId !== element);
}

function renderTemplateWithPreview(user) {
  Adapter.getPreview(user.username).then(obj => {
    user.preview = obj
  })
  .then(resp => {
    Repository.renderTemplateStr(user.repositories(), user)
  })
}

function handleClick(e){
  if (e.target.className === "user") {
    let username = e.target.textContent
    Adapter.findUserRepos(username)
    .then(repos => {
      user = User.findByUsername(username)
      renderTemplateWithPreview(user)
    })
  } else if (e.target.id === "refresh") {
    let buttonEl = e.target.dataset.username
    username = buttonEl,
    user = User.findByUsername(username);
    if (buttonEl !== "none") {
      Adapter.createUserAndRepos(username)
      .then(repos => {
        user = User.findByUsername(username)
        store.repositories = cleanStore(store.repositories, user.id)
        repos.map(repo => new Repository(repo, store)) // make the repos from DB into memory repos
        Repository.renderTemplateStr(user.repositories(), user) // now we can access them by searching our store
        })
    } 
  } else if (e.target.className === "copy-button") {
    clipBoard(e)
  }
}

document.querySelector("form").addEventListener("submit", (e) => {
  console.log("submit!")
  let inputEl = document.querySelector("#username-input"),
  username = inputEl.value.trim().toLowerCase(), regex = /\s/, user;
  
  if (!regex.test(RegExp(username)) &&  username.length !== 0) {
    
    document.querySelector("#html-code").innerText = "Loading template..."
    Adapter.createUserAndRepos(username)
    .then(repos => {
      if (repos.length > 0) {
        if (User.findByUsername(username)) {
          user = User.findByUsername(username)
        } else {
          user = new User({"username": username, "id": repos[0].user_id}, store)
          user.renderSelf()
        }
          repos.map(repo => new Repository(repo, store)) // make the repos from DB into memory repos
          renderTemplateWithPreview(user)
        }
        
      })
      inputEl.value = ''
      e.preventDefault()
    } else {
    alert("Spaces are not allowed")
    inputEl.value = ''
    e.preventDefault()
  }
  
  
})

document.addEventListener('DOMContentLoaded', init)
document.addEventListener("click", handleClick)