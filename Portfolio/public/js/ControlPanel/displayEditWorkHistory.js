// Function to display the Edit Work History section
function displayEditWorkHistory() {
    // Clear input fields
    document.getElementById('work-history-title').value = '';
    document.getElementById('work-history-company').value = '';
    document.getElementById('work-history-duration').value = '';

    // Get the user ID from local storage
    const uid = localStorage.getItem('uid');
    if (!uid) {
        console.error('User ID not found in local storage');
        return;
    }

    // Reference to the user's PersonalPage document
    const personalPageRef = firestore.collection('users').doc(uid).collection('PersonalPage').doc('PersonalPageID');

    // Get the work history array from Firestore
    personalPageRef.get()
        .then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                const workHistoryArray = data.workHistory || []; // Initialize work history array or use existing array

                // Display work history list with trash icon
                const workHistoryList = document.getElementById('work-history-list');
                workHistoryList.innerHTML = ''; // Clear previous list items

                workHistoryArray.forEach((work, index) => {
                    const listItem = document.createElement('li');

                    // Create and append text content
                    const workInfo = document.createElement('span');
                    workInfo.textContent = `${work.title} at ${work.company}, ${work.duration}`;
                    listItem.appendChild(workInfo);

                    // Add trash icon to remove the work history entry
                    const trashIcon = document.createElement('i');
                    trashIcon.classList.add('fas', 'fa-trash-alt');
                    trashIcon.addEventListener('click', () => removeWorkHistory(index));

                    listItem.appendChild(trashIcon);
                    workHistoryList.appendChild(listItem);
                });
            } else {
                console.error('PersonalPage document not found');
            }
        })
        .catch((error) => {
            console.error('Error fetching work history: ', error);
        });
}

// Function to remove a work history entry from the array in Firestore
function removeWorkHistory(index) {
    // Get the user ID from local storage
    const uid = localStorage.getItem('uid');
    if (!uid) {
        console.error('User ID not found in local storage');
        return;
    }

    // Reference to the user's PersonalPage document
    const personalPageRef = firestore.collection('users').doc(uid).collection('PersonalPage').doc('PersonalPageID');

    // Get the current work history array from Firestore
    personalPageRef.get()
        .then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                let workHistoryArray = data.workHistory || []; // Initialize work history array or use existing array

                // Remove the work history entry at the specified index
                if (index >= 0 && index < workHistoryArray.length) {
                    workHistoryArray.splice(index, 1);

                    // Update the work history field in Firestore
                    return personalPageRef.update({
                        workHistory: workHistoryArray
                    });
                }
            } else {
                console.error('PersonalPage document not found');
            }
        })
        .then(() => {
            console.log('Work history entry removed successfully');
            // Update the displayed work history list
            displayEditWorkHistory();
        })
        .catch((error) => {
            console.error('Error removing work history entry: ', error);
        });
}

// Call the function to display the Edit Work History section
displayEditWorkHistory();
