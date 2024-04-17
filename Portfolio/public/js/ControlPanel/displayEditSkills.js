// displayEditSkills.js

// Function to display the Edit Skills section
function displayEditSkills() {
    // Clear input field
    document.getElementById('skills').value = '';

    // Get the user ID from local storage
    const uid = localStorage.getItem('uid');
    if (!uid) {
        console.error('User ID not found in local storage');
        return;
    }

    // Reference to the user's PersonalPage document
    const personalPageRef = firestore.collection('users').doc(uid).collection('PersonalPage').doc('PersonalPageID');

    // Get the skills array from Firestore
    personalPageRef.get()
        .then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                const skillsArray = data.skills || []; // Initialize skills array or use existing array

                // Display skills list with trash icon
                const skillsList = document.getElementById('skills-list');
                skillsList.innerHTML = ''; // Clear previous list items

                skillsArray.forEach((skill, index) => {
                    const listItem = document.createElement('li');
                    listItem.textContent = skill;

                    // Add trash icon to remove the skill
                    const trashIcon = document.createElement('i');
                    trashIcon.classList.add('fas', 'fa-trash-alt');
                    trashIcon.addEventListener('click', () => removeSkill(index));

                    listItem.appendChild(trashIcon);
                    skillsList.appendChild(listItem);
                });
            } else {
                console.error('PersonalPage document not found');
            }
        })
        .catch((error) => {
            console.error('Error fetching skills: ', error);
        });
}

// Function to remove a skill from the skills array in Firestore
function removeSkill(index) {
    // Get the user ID from local storage
    const uid = localStorage.getItem('uid');
    if (!uid) {
        console.error('User ID not found in local storage');
        return;
    }

    // Reference to the user's PersonalPage document
    const personalPageRef = firestore.collection('users').doc(uid).collection('PersonalPage').doc('PersonalPageID');

    // Get the current skills array from Firestore
    personalPageRef.get()
        .then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                let skillsArray = data.skills || []; // Initialize skills array or use existing array

                // Remove the skill at the specified index
                if (index >= 0 && index < skillsArray.length) {
                    skillsArray.splice(index, 1);

                    // Update the skills field in Firestore
                    return personalPageRef.update({
                        skills: skillsArray
                    });
                }
            } else {
                console.error('PersonalPage document not found');
            }
        })
        .then(() => {
            console.log('Skill removed successfully');
            // Update the displayed skills list
            displayEditSkills();
        })
        .catch((error) => {
            console.error('Error removing skill: ', error);
        });
}


// Call the function to display the Edit Skills section
displayEditSkills();
