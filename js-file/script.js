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
    signUpButton.classList.toggle('unfocus')
    signInButton.classList.toggle('unfocus')
    registForm.classList.remove('focus-field')
    submitButton.classList.remove('focus-submit-btn')
    focusInputField.forEach(input => {
        input.classList.remove('focus-input-field')
    })
    userNameinput.classList.remove('hidden')
})

signInButton.addEventListener('click', () => {
    registForm.id = 'signin-form'
    submitButton.textContent = 'Sign In'
    signInButton.classList.toggle('unfocus')
    signUpButton.classList.toggle('unfocus')
    userNameinput.classList.add("hidden")
    registForm.classList.add('focus-field')
    submitButton.classList.add('focus-submit-btn')
    focusInputField.forEach(input => {
        input.classList.add('focus-input-field')
    })

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

const signLinks = (signin) => { //(token) // посомтреть как исправить
    if (signin) {
        db.collection('users').doc(signin.uid).get().then((user) => {
            const html = `
                <p>You email: ${signin.email}</p>
                <p>You nickname: ${user.data().username}</p>
            `
            accountContent.innerHTML = html;

        })
        signOutLinks.forEach(link => link.style.display = "block")
        signInLinks.style.display = "none"
    } else {
        signOutLinks.forEach(link => link.style.display = "none")
        signInLinks.style.display = "block"
        accountContent.innerHTML = ''
    }
}


auth.onAuthStateChanged((user) => { //(token)
    if (user) {
        db.collection('todo').onSnapshot((users) => {
            showTask(users)
            signLinks(user)
        })
    } else {
        signLinks()
        showTask([])
    }
})

const signOut = document.querySelector('.signout')

signOut.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut()
})

const accoutInfo = document.querySelector('.account-info')
const accountSection = document.querySelector('.section-account')

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
            <ul class="das">
                <li class=""> 
                <input type="checkbox" data-checkbox id="${id}" data-id="${id}" style="display: none"/>
                <label for="${id}" class="label" data-label>
                <img src="Group.png" alt="task-done" data-id="${id}" data-checkbox-img class="a" width = "5%"/>
                </label>
                    <input type='text'data-id="${id}" name="tasks" class="added-task" value='${data.task}' disabled/> 
                    <button data-id="${id}" data-delete-btn>Delete</button>
                    <button data-id="${id}" data-edit-btn>Edit</button
                </li>
            </ul>
            `
        html += ul
    });

    toDoList.innerHTML = html

    toDoList.querySelectorAll('[data-delete-btn]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id
            db.collection('todo').doc(id).delete()

        })
    })

    const inputTasksEdit = document.querySelectorAll('.added-task');

    toDoList.querySelectorAll('[data-edit-btn]').forEach(btn => {

        btn.addEventListener('click', (e) => {

            const id = e.target.dataset.id;
            inputTasksEdit.forEach(task => {
                const taskId = task.dataset.id
                if (id === taskId) {
                    task.removeAttribute('disabled')
                    task.addEventListener('keydown', (e) => {
                        if (e.keyCode === 13) {
                            task.setAttribute('disabled', true)
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
        item.addEventListener('click', (e) => {

            const id = e.target.dataset.id
            if (item.checked) {
                db.collection('todo').doc(id).update({
                    done: item.checked
                })
                inputTasksEdit.forEach(item => {
                    const itemId = item.dataset.id
                    if (itemId === id) {
                        item.style.textDecoration = 'line-through'
                    }
                })
                images.forEach(img => {
                    const imgId = img.dataset.id
                    if (imgId === id) {
                        img.src = 'check.png'
                    }
                })
            } else {
                db.collection('todo').doc(id).update({
                    done: item.checked
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

const accountImg = document.querySelector('[data-account-img]')
console.log(accountImg)
accountImg.addEventListener('click', (e) => {
    console.log("Avatar")
})