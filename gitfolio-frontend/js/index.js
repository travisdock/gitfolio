 console.log("index");
store = {
  users: [],
  repositories: []
}

function init() {
  User.renderUsers()
}

init()

document.querySelector("form").addEventListener("submit", (e) => {
  console.log("submit!")
  let inputEl = document.querySelector("#username-input"),
    username = inputEl.value, user;

  Adapter.createUserAndRepos(username)
    .then(repos => {
      if (repos.length > 0) {
        if (User.findByUsername(username)) {
          user = User.findByUsername(username)
        } else {
          user = new User({"username": username, "id": repos[0].user_id}, store)
          user.renderSelf()
        }
        // Repository.createUserRepos(user.username, true)
          // .then(repos => {
            // console.log(repos);
        repos.map(repo => new Repository(repo, store))
        Repository.renderTemplateStr(user.repositories())
          // })
      }
    })
    
  e.preventDefault()
})

document.querySelector("#users").addEventListener("click", (e) => {
  if (e.target.className === "user") {
    let username = e.target.textContent
    Adapter.findUserRepos(username)
      .then(repos => {
        user = User.findByUsername(username)
        Repository.renderTemplateStr(user.repositories())
      })
  }
})

