// Function to display the Edit Education section
function displayEditEducation() {
    // Clear input field
    document.getElementById('education').value = '';

    // Get the user ID from local storage
    const uid = localStorage.getItem('uid');
    if (!uid) {
        console.error('User ID not found in local storage');
        return;
    }

    // Reference to the user's PersonalPage document
    const personalPageRef = firestore.collection('users').doc(uid).collection('PersonalPage').doc('PersonalPageID');

    // Get the education array from Firestore
    personalPageRef.get()
        .then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                const educationArray = data.education || []; // Initialize education array or use existing array

                // Display education list
                const educationList = document.getElementById('education-list');
                educationList.innerHTML = ''; // Clear previous list items

                educationArray.forEach((education, index) => {
                    const listItem = document.createElement('li');
                    listItem.textContent = education;

                    // Add trash icon to remove the education
                    const trashIcon = document.createElement('i');
                    trashIcon.classList.add('fas', 'fa-trash-alt');
                    trashIcon.addEventListener('click', () => removeEducation(index));

                    listItem.appendChild(trashIcon);
                    educationList.appendChild(listItem);
                });
            } else {
                console.error('PersonalPage document not found');
            }
        })
        .catch((error) => {
            console.error('Error fetching education: ', error);
        });
}

// Function to remove an education from the education array in Firestore
function removeEducation(index) {
    // Get the user ID from local storage
    const uid = localStorage.getItem('uid');
    if (!uid) {
        console.error('User ID not found in local storage');
        return;
    }

    // Reference to the user's PersonalPage document
    const personalPageRef = firestore.collection('users').doc(uid).collection('PersonalPage').doc('PersonalPageID');

    // Get the current education array from Firestore
    personalPageRef.get()
        .then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                let educationArray = data.education || []; // Initialize education array or use existing array

                // Remove the education at the specified index
                if (index >= 0 && index < educationArray.length) {
                    educationArray.splice(index, 1);

                    // Update the education field in Firestore
                    return personalPageRef.update({
                        education: educationArray
                    });
                }
            } else {
                console.error('PersonalPage document not found');
            }
        })
        .then(() => {
            console.log('Education removed successfully');
            // Update the displayed education list
            displayEditEducation();
        })
        .catch((error) => {
            console.error('Error removing education: ', error);
        });
}

// Event listener for the form submit event
document.addEventListener('DOMContentLoaded', () => {
    // Call the function to display the Edit Education section
    displayEditEducation();

    // Add an event listener to the form submit event
    editEducationForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        // Get the value from the education input field
        const newEducation = document.getElementById('education').value.trim();

        // Exit if the education input is empty
        if (!newEducation) {
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

        // Update the education field in Firestore
        personalPageRef.get()
            .then((doc) => {
                if (doc.exists) {
                    const data = doc.data();
                    let educationArray = data.education || []; // Initialize education array or use existing array

                    // Append the new education to the education array if it doesn't already exist
                    if (!educationArray.includes(newEducation)) {
                        educationArray.push(newEducation);

                        // Update the education field in Firestore
                        return personalPageRef.update({
                            education: educationArray
                        });
                    }
                } else {
                    console.error('PersonalPage document not found');
                }
            })
            .then(() => {
                console.log('Education updated successfully');
                displayEditEducation();
            })
            .catch((error) => {
                console.error('Error updating education: ', error);
            });
    });
});

// Function to hide the edit education form
function hideEditEducationForm(formId) {
    document.getElementById(formId).style.display = 'none';
}
