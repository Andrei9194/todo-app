firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

const signUpButton = document.querySelector('.signup')
const signInButton = document.querySelector('.signin')
const registForm = document.querySelector('#signup-form')
const registSection = document.querySelector('.regist-section')
const submitButton = document.querySelector('.submit-btn')
const focusInputField = document.querySelectorAll('.input-field')
const userNameinput = document.querySelector('.username');


signUpButton.addEventListener('click', () => {
    registForm.id = 'signup-form'
    submitButton.textContent = 'Sign Up'
    signUpButton.classList.remove('unfocus')
    signInButton.classList.add('unfocus')
    registForm.classList.remove('focus-field')
    submitButton.classList.remove('focus-submit-btn')
    focusInputField.forEach(input => {
        input.classList.remove('focus-input-field')
    })
    userNameinput.classList.remove('hidden')
    registForm.reset();
})

signInButton.addEventListener('click', () => {
    registForm.id = 'signin-form'
    submitButton.textContent = 'Sign In'
    signInButton.classList.remove('unfocus')
    signUpButton.classList.add('unfocus')
    userNameinput.classList.add("hidden")
    registForm.classList.add('focus-field')
    submitButton.classList.add('focus-submit-btn')
    focusInputField.forEach(input => {
        input.classList.add('focus-input-field')
    })
    registForm.reset();
})

const getData = (e) => {
    e.preventDefault();
    const email = registForm['email'].value;
    const password = registForm['password'].value;

    const datas = {
            email,
            password
        }
        // посмотреть как исправить
    if (registForm.id === 'signup-form') {
        userSignUp(datas)
    } else {
        userSignIn(datas)
    }
    registForm.reset();
}

const header = document.querySelector('.header')
const signOutBody = document.querySelector('body')

const userSignIn = (token) => {
    auth.signInWithEmailAndPassword(token.email, token.password).then((user) => {
        registSection.classList.add('hidden')
    })
}

const userSignUp = (token) => {
    const userNickName = registForm['nickname'].value

    auth.createUserWithEmailAndPassword(token.email, token.password)
        .then((cred) => {
            return db.collection('users').doc(cred.user.uid).set({
                username: userNickName
            })
        })
        .then(() => {
            auth.signOut()
        })
}

registForm.addEventListener('submit', getData);

const signOutLinks = document.querySelectorAll('.signed-out')
const signInLinks = document.querySelector('.signed-in');
const accountContent = document.querySelector('.account-content')
const headerSignIn = document.querySelector('.header')

const signLinks = (signin) => { //(token) // посомтреть как исправить
    if (signin) {
        db.collection('users').doc(signin.uid).get().then((user) => {
            const html = `
                <p class='account-content username-info'>${user.data().username}</p>
                <p class='account-content email-info'>${signin.email}</p>
            `
            accountContent.innerHTML = html;

        })

        // add function addProfilePicture
        signOutLinks.forEach(link => link.classList.remove("hidden"))
        signInLinks.classList.add('hidden')
        headerSignIn.classList.add('header-signIn')
    } else {
        signOutLinks.forEach(link => link.classList.add("hidden"))
        signInLinks.classList.remove('hidden')
        headerSignIn.classList.remove('header-signIn')
        accountContent.innerHTML = ''
    }

}


auth.onAuthStateChanged((user) => { //(token)
    if (user) {
        db.collection('todo').onSnapshot((users) => {
            showTask(users)
            signLinks(user)

        })
        signOutBody.classList.add('body-sign-out')
        addImage(user.uid)
        getProfilePicture(user.uid)
            .then(imgUrl => {
                imgAccount.src = imgUrl
                accountImg.src = imgUrl
            })
    } else {
        signLinks()
        showTask([])
        getProfilePicture()
        signOutBody.classList.remove('body-sign-out')
        accountSection.classList.add('hidden')
    }
})

const signOut = document.querySelector('.signout')

signOut.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut();
})

const accoutInfo = document.querySelector('.account-info')
const accountSection = document.querySelector('.section-account')

const accountImg = document.querySelector('.accoun-info-img')
console.log(accountImg.src)
accoutInfo.addEventListener('click', (e) => {
    e.preventDefault();
    accountSection.classList.toggle("hidden");
})

const toDoList = document.querySelector('.todo-list')

const showTask = (tasks) => { //token
    let html = "";
    tasks.forEach(task => {
        const id = task.id;
        const data = task.data();
        const ul = `
            <div>
                <form class='task-content'>
                    <div class='lable-section'>
                        <label for="${id}" data-label>
                            <img src="Group.png" alt="task-done" data-id="${id}" data-checkbox-img class="a" />
                            <input type="checkbox" data-checkbox id="${id}"  style="display: none"/>
                        </label>
                        <label class="task-label" for="${id}">
                            <input type='text' id="${id} "data-id="${id}" name="tasks" class="added-task" value='${data.task}' disabled/> 
                        </label>
                    </div>
                    <div class='button-area'>
                        <button data-id="${id}" class='button-edit' data-edit-btn><img src="./assets/edit_button.png" data-id="${id}" alt="add-task-button" class="img-edit-task"></button>
                        <button data-id="${id}" class='button-delete' data-delete-btn ><img src="./assets/delete_button.png" data-id="${id}" alt="add-task-button" class="img-delete-task"></button>
                    </div>
                 </form>
             </div>
            `
        html += ul
    });

    toDoList.innerHTML = html

    toDoList.querySelectorAll('[data-delete-btn]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault()
            const id = e.target.dataset.id
            db.collection('todo').doc(id).delete()

        })
    })

    const inputTasksEdit = document.querySelectorAll('.added-task');

    toDoList.querySelectorAll('[data-edit-btn]').forEach(btn => {

        btn.addEventListener('click', (e) => {
            e.preventDefault()
            const id = e.target.dataset.id;
            images.forEach(img => {
                const imgId = img.dataset.id
                if (imgId === id) {
                    img.setAttribute("src", "Group.png")
                }
            })
            inputTasksEdit.forEach(task => {
                const taskId = task.dataset.id
                if (id === taskId) {
                    task.removeAttribute('disabled')
                    task.style.textDecoration = 'none'
                    task.style.borderBottom = '1px solid black'
                    task.addEventListener('keydown', (e) => {
                        if (e.keyCode === 13) {
                            task.setAttribute('disabled', true)
                            task.style.border = 'none'
                            db.collection('todo').doc(id).update({
                                task: task.value
                            })
                        }
                    })
                }
            })
        })
    })

    const checkbox = document.querySelectorAll('[data-checkbox]')
    const images = document.querySelectorAll('[data-checkbox-img]');

    checkbox.forEach(item => {

        item.addEventListener('change', (e) => {

            const id = e.target.id;
            const done = item.checked

            db.collection('todo').doc(id).update({
                done
            })
            if (item.checked) {
                inputTasksEdit.forEach(item => {
                    const itemId = item.dataset.id
                    if (itemId === id) {
                        item.style.textDecoration = 'line-through'
                    }
                })
                images.forEach(img => {
                    const imgId = img.dataset.id
                    if (imgId === id) {
                        img.setAttribute("src", "check.png")
                    }
                })
            }
        })
    })
}


const toDoForm = document.querySelector('#todo-form')

toDoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('todo').add({
        task: toDoForm['todo-input'].value,
        done: false
    }).then(() => {
        toDoForm.reset();
    }).catch((err) => {
        toDoForm.reset();
        alert(err.message)
    })
})


let file = {}
const userAvatar = document.querySelector('[data-userAvatar]')
const imgAccount = document.querySelector('[data-account-img]')

const addImage = (id) => {
    userAvatar.addEventListener('change', (e) => {
        file = userAvatar.files[0]
        addPictureToStorage(id, file).then(() => {
            console.log("upload", file.name)
        })
    })
}

const addPictureToStorage = (id, file) => {
    return firebase.storage().ref(`images/${id}/profile.jpg`).put(file);
}

const getProfilePicture = id => {
    return firebase.storage().ref(`images/${id}/profile.jpg`).getDownloadURL()
}

console.log(userAvatar)