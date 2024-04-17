// login.js
function loginUser() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Logged in successfully
            const user = userCredential.user;
            console.log("User logged in:", user);
            // Store UID in localStorage
            localStorage.setItem('uid', user.uid);
            window.location.href = "main.html";
        })
        .catch((error) => {
            // Handle errors
            console.error("Login failed:", error.message);
            alert("Login failed: " + error.message);
        });
}
