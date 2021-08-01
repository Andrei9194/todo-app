firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

const signUpButton = document.querySelector('.signup')
const signInButton = document.querySelector('.signin')
const registForm = document.querySelector('#signup-form')
const mainForm = document.querySelector('.mainForm')

const getData = (e) => {
    e.preventDefault();

    const email = registForm['email'].value;
    const password = registForm['password'].value;

    const datas = {
        email,
        password
    }
    if (registForm.id === 'signup-form') {
        userSignUp(datas)
    } else {
        userSignIn(datas)
    }
    registForm.reset();
}
signUpButton.addEventListener('click', () => {
    registForm.style.backgroundColor = "red"
    registForm.id = 'signup-form'
})
signInButton.addEventListener('click', () => {
    registForm.style.backgroundColor = "blue"
    registForm.id = 'sign-form'
})

const userSignIn = (token) => {
    auth.signInWithEmailAndPassword(token.email, token.password).then(() => {
        mainForm.classList.add('hidden')
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
            auth.signOut().then(() => {
                console.log('sign out')
            })
        })
}

registForm.addEventListener('submit', getData);