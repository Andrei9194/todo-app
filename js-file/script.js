firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

const signUpButton = document.querySelector('.signup')
const signInButton = document.querySelector('.signin')
const registForm = document.querySelector('#signup-form')
const registSection = document.querySelector('.regist-section')

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

const header = document.querySelector('.header')

const userSignIn = (token) => {
    auth.signInWithEmailAndPassword(token.email, token.password).then(() => {
        registSection.classList.add('hidden')
        header.classList.remove('hidden')

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

const signOutLinks = document.querySelectorAll('.signed-out')
const signInLinks = document.querySelector('.signed-in');

console.log(signOutLinks);
console.log(signInLinks)

auth.onAuthStateChanged((user) => {
    if (user) {
        signOutLinks.forEach(link => link.style.display = "block")
        signInLinks.style.display = "none"
    } else {
        signOutLinks.forEach(link => link.style.display = "none")
        signInLinks.style.display = "block"
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