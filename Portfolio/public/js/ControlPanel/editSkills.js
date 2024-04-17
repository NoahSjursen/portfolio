// Get a reference to the edit skills form
const editSkillsForm = document.getElementById('edit-skills-form');

// Add an event listener to the form submit event
editSkillsForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Get the value from the skills input field
    const newSkill = document.getElementById('skills').value.trim();

    // Exit if the skill input is empty
    if (!newSkill) {
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

    // Update the skills field in Firestore
    personalPageRef.get()
        .then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                let skillsArray = data.skills || []; // Initialize skills array or use existing array

                // Append the new skill to the skills array if it doesn't already exist
                if (!skillsArray.includes(newSkill)) {
                    skillsArray.push(newSkill);

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
            console.log('Skills updated successfully');
            displayEditSkills();
        })
        .catch((error) => {
            console.error('Error updating skills: ', error);
        });
});

// Function to hide the edit skills form
function hideEditForm(formId) {
    document.getElementById(formId).style.display = 'none';
}
