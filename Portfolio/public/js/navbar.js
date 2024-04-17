document.addEventListener("DOMContentLoaded", function () {
    // Function to set the username in the logo
    function setUserNameInLogo(username) {
        const logoElement = document.querySelector('.logo');
        if (logoElement) {
            // Check if username exists or if it's 'null'
            if (username && username !== 'null') {
                logoElement.textContent = `${username}'s Portfolio`;
            } else {
                // If username doesn't exist or is 'null', try to get UID from URL
                const uidFromUrl = getUidFromUrl();
                if (uidFromUrl) {
                    // Use UID from URL to fetch username
                    firestore.collection("users").doc(uidFromUrl).get()
                        .then((doc) => {
                            if (doc.exists) {
                                const userData = doc.data();
                                const usernameFromUrl = userData.username;
                                logoElement.textContent = `${usernameFromUrl}'s Portfolio`;
                            } else {
                                console.log("User data not found");
                                logoElement.textContent = "Your Portfolio";
                            }
                        })
                        .catch((error) => {
                            console.error("Error getting user data:", error);
                            logoElement.textContent = "Your Portfolio";
                        });
                } else {
                    // If UID is not in the URL, use UID from local storage
                    const uidFromLocalStorage = localStorage.getItem('uid');
                    if (uidFromLocalStorage) {
                        firestore.collection("users").doc(uidFromLocalStorage).get()
                            .then((doc) => {
                                if (doc.exists) {
                                    const userData = doc.data();
                                    const usernameFromLocalStorage = userData.username;
                                    logoElement.textContent = `${usernameFromLocalStorage}'s Portfolio`;
                                } else {
                                    console.log("User data not found");
                                    logoElement.textContent = "Your Portfolio";
                                }
                            })
                            .catch((error) => {
                                console.error("Error getting user data:", error);
                                logoElement.textContent = "Your Portfolio";
                            });
                    } else {
                        // If UID is not in local storage as well, set default text
                        logoElement.textContent = "Your Portfolio";
                    }
                }
            }
        }
    }


    // Function to update login button text based on authentication state
    function updateLoginButtonText(user) {
        const loginButton = document.querySelector('.login-btn');
        if (loginButton) {
            if (user) {
                // User is signed in
                loginButton.textContent = 'Logout';
            } else {
                // User is signed out
                loginButton.textContent = 'Login';
            }
        }
    }
   
    // Function to parse URL parameters and extract UID
    function getUidFromUrl() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        return urlParams.has('uid') ? urlParams.get('uid') : null;
    }

    // Listen for authentication state changes
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in
            // Fetch the username from Firestore using the user's UID
            const uid = getUidFromUrl() || user.uid; // Use UID from URL if present, otherwise use user's UID
            firestore.collection("users").doc(uid).get()
                .then((doc) => {
                    if (doc.exists) {
                        // User data found, get the username field
                        const userData = doc.data();
                        const username = userData.username;
                        setUserNameInLogo(username ? username : 'null');
                    } else {
                        console.log("User data not found");
                        setUserNameInLogo('null');
                    }
                })
                .catch((error) => {
                    console.error("Error getting user data:", error);
                    setUserNameInLogo('null');
                });
        } else {
            // User is signed out
            setUserNameInLogo('null');
        }
        // Update login button text
        updateLoginButtonText(user);
    });

    // Function to hide the control panel dropdown if UID is present in the URL
    function hideControlPanelDropdown() {
        const uidFromUrl = getUidFromUrl();
        if (uidFromUrl) {
            const controlPanelDropdown = document.querySelector('.control-panel-dropdown');
            if (controlPanelDropdown) {
                controlPanelDropdown.style.display = 'none';
            }
        }
    }

    // Call the function to hide the control panel dropdown when the page loads
    hideControlPanelDropdown();

    // Function to show the share modal
    function showShareModal() {
        const modal = document.getElementById('shareModal');
        modal.style.display = 'block';
    }

    // Function to generate the shareable link
    function generateShareableLink() {
        const currentUrl = window.location.href;
        const uid = localStorage.getItem('uid');
        const shareLinkInput = document.getElementById('shareLink');
        shareLinkInput.value = `${currentUrl}?uid=${uid}`;
    }

    // Function to copy the generated link
    function copyLink() {
        const shareLinkInput = document.getElementById('shareLink');
        shareLinkInput.select();
        document.execCommand('copy');
        alert('Link copied to clipboard!');
    }

    // Event listener for the share button
    document.getElementById('shareBtn').addEventListener('click', function() {
        showShareModal();
        generateShareableLink();
    });

    // Event listener for the copy button
    document.getElementById('copyBtn').addEventListener('click', function() {
        copyLink();
    });

    // Close the modal when the user clicks on the close button
    document.getElementsByClassName('close')[0].addEventListener('click', function() {
        const modal = document.getElementById('shareModal');
        modal.style.display = 'none';
    });

    // Close the modal when the user clicks anywhere outside of it
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('shareModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});