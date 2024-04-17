// Function to display the Edit Social Media section
function displayEditSocialMedia() {
    // Clear input field
    document.getElementById('social-media').value = '';

    // Get the user ID from local storage
    const uid = localStorage.getItem('uid');
    if (!uid) {
        console.error('User ID not found in local storage');
        return;
    }

    // Reference to the user's PersonalPage document
    const personalPageRef = firestore.collection('users').doc(uid).collection('PersonalPage').doc('PersonalPageID');

    // Get the social media links array from Firestore
    personalPageRef.get()
        .then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                const socialMediaArray = data.socialMedia || []; // Initialize social media array or use existing array

                // Display social media links list
                const socialMediaList = document.getElementById('social-media-list');
                socialMediaList.innerHTML = ''; // Clear previous list items

                socialMediaArray.forEach((socialMediaLink, index) => {
                    const listItem = document.createElement('li');
                    listItem.textContent = socialMediaLink;

                    // Add trash icon to remove the social media link
                    const trashIcon = document.createElement('i');
                    trashIcon.classList.add('fas', 'fa-trash-alt');
                    trashIcon.addEventListener('click', () => removeSocialMediaLink(index));

                    listItem.appendChild(trashIcon);
                    socialMediaList.appendChild(listItem);
                });
            } else {
                console.error('PersonalPage document not found');
            }
        })
        .catch((error) => {
            console.error('Error fetching social media links: ', error);
        });
}

// Function to remove a social media link from the array in Firestore
function removeSocialMediaLink(index) {
    // Get the user ID from local storage
    const uid = localStorage.getItem('uid');
    if (!uid) {
        console.error('User ID not found in local storage');
        return;
    }

    // Reference to the user's PersonalPage document
    const personalPageRef = firestore.collection('users').doc(uid).collection('PersonalPage').doc('PersonalPageID');

    // Get the current social media links array from Firestore
    personalPageRef.get()
        .then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                let socialMediaArray = data.socialMedia || []; // Initialize social media array or use existing array

                // Remove the social media link at the specified index
                if (index >= 0 && index < socialMediaArray.length) {
                    socialMediaArray.splice(index, 1);

                    // Update the social media links field in Firestore
                    return personalPageRef.update({
                        socialMedia: socialMediaArray
                    });
                }
            } else {
                console.error('PersonalPage document not found');
            }
        })
        .then(() => {
            console.log('Social Media link removed successfully');
            // Update the displayed social media links list
            displayEditSocialMedia();
        })
        .catch((error) => {
            console.error('Error removing social media link: ', error);
        });
}

// Event listener for the form submit event
document.addEventListener('DOMContentLoaded', () => {
    // Call the function to display the Edit Social Media section
    displayEditSocialMedia();

    // Add an event listener to the form submit event
    editSocialMediaForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        // Get the value from the social media input field
        const newSocialMediaLink = document.getElementById('social-media').value.trim();

        // Exit if the social media input is empty
        if (!newSocialMediaLink) {
            return;
        }

        // Get the user ID from local storage
        const uid = localStorage.getItem('uid');
        if (!uid) {
            console.error('User ID not found in local storage');
            return; // Exit the function if user ID is not found
        }

        // Reference to the user's PersonalPage document
        const personalPageRef = firestore.collection('users').doc(uid).collection('PersonalPage').doc('PersonalPageID');

        // Update the social media links field in Firestore
        personalPageRef.get()
            .then((doc) => {
                if (doc.exists) {
                    const data = doc.data();
                    let socialMediaArray = data.socialMedia || []; // Initialize social media array or use existing array

                    // Append the new social media link to the array if it doesn't already exist
                    if (!socialMediaArray.includes(newSocialMediaLink)) {
                        socialMediaArray.push(newSocialMediaLink);

                        // Update the social media links field in Firestore
                        return personalPageRef.update({
                            socialMedia: socialMediaArray
                        });
                    }
                } else {
                    console.error('PersonalPage document not found');
                }
            })
            .then(() => {
                console.log('Social Media links updated successfully');
                displayEditSocialMedia();
            })
            .catch((error) => {
                console.error('Error updating social media links: ', error);
            });
    });
});

// Function to hide the edit social media form
function hideEditSocialMediaForm(formId) {
    document.getElementById(formId).style.display = 'none';
}
