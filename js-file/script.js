firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();

const signUpButton = document.querySelector('.signup')
const signInButton = document.querySelector('.signin')
const registForm = document.querySelector('#registration-form')


signUpButton.addEventListener('click', (e) => {
    registForm.style.backgroundColor = "red"
    registForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const userNickName = registForm['nickname'].value;
        const email = registForm['email'].value
        const password = registForm['password'].value

        auth.createUserWithEmailAndPassword(email, password)
            .then((token) => {
                return db.collection('users').doc(token.user.uid).set({
                    username: userNickName
                })
            })
            .then(() => {
                registForm.reset();
            })
            .then(() => {
                auth.signOut().then(() => {
                    console.log('sign out')
                })
            })

    })

})