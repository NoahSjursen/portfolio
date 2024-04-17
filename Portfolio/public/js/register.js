// register.js
function registerUser() {
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    const username = document.getElementById("registerUsername").value; // Get username

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Registered successfully
            const user = userCredential.user;
            console.log("User registered:", user);

            // Add user to Firestore with email, username, and bio
            const userData = {
                email: email,
                username: username,
            };

            firestore.collection("users").doc(user.uid).set(userData)
            .then(() => {
                console.log("User added to Firestore");
                localStorage.setItem('uid', user.uid); // Store UID in localStorage
                window.location.href = "main.html";
            })
            .catch((error) => {
                console.error("Error adding user to Firestore:", error);
                alert("Registration failed: " + error.message);
            });
        })
        .catch((error) => {
            // Handle errors
            console.error("Registration failed:", error.message);
            alert("Registration failed: " + error.message);
        });
}
