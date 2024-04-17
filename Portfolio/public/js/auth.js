// Include login.js
document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.getElementById("loginButton");
    if (loginButton) {
        loginButton.addEventListener("click", loginUser);
    }
});
