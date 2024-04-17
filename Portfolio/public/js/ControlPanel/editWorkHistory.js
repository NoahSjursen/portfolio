// Get a reference to the edit work history form
const editWorkHistoryForm = document.getElementById('edit-work-history-form');

// Add an event listener to the form submit event
editWorkHistoryForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Get the values from the work history input fields
    const title = document.getElementById('work-history-title').value.trim();
    const company = document.getElementById('work-history-company').value.trim();
    const duration = document.getElementById('work-history-duration').value.trim();

    // Exit if any of the input fields are empty
    if (!title || !company || !duration) {
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

    // Update the work history field in Firestore
    personalPageRef.get()
        .then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                let workHistoryArray = data.workHistory || []; // Initialize work history array or use existing array

                // Append the new work history entry to the array
                workHistoryArray.push({
                    title: title,
                    company: company,
                    duration: duration
                });

                // Update the work history field in Firestore
                return personalPageRef.update({
                    workHistory: workHistoryArray
                });
            } else {
                console.error('PersonalPage document not found');
            }
        })
        .then(() => {
            console.log('Work history updated successfully');
            displayEditWorkHistory();
        })
        .catch((error) => {
            console.error('Error updating work history: ', error);
        });
});

// Function to hide the edit work history form
function hideEditForm(formId) {
    document.getElementById(formId).style.display = 'none';
}
