// Get a reference to the project list container
const projectList = document.getElementById('project-list');

// Function to display projects
function displayProjects(projects) {
    projectList.innerHTML = ''; // Clear existing project list

    projects.forEach((project) => {
        const projectItem = document.createElement('div');
        projectItem.classList.add('project-item');

        // Display project details
        const projectName = document.createElement('h3');
        projectName.textContent = 'Project Name: ' + project.projectName;
        projectItem.appendChild(projectName);

        const projectDescription = document.createElement('p');
        projectDescription.textContent = 'Description: ' + project.projectDescription;
        projectItem.appendChild(projectDescription);

        // Display media URLs as plain text
        if (Array.isArray(project.projectMedia) && project.projectMedia.length > 0) {
            project.projectMedia.forEach((mediaURL) => {
                const mediaText = document.createElement('p');
                mediaText.textContent = shortenURL(mediaURL);
                projectItem.appendChild(mediaText);
            });
        }


        const projectLinks = document.createElement('p');
        projectLinks.textContent = 'Links: ' + project.projectLinks;
        projectItem.appendChild(projectLinks);

        const projectStatus = document.createElement('p');
        projectStatus.textContent = 'Status: ' + project.projectStatus;
        projectItem.appendChild(projectStatus);

        const completionDate = document.createElement('p');
        completionDate.textContent = 'Completion Date: ' + project.projectDate;
        projectItem.appendChild(completionDate);

        const notes = document.createElement('p');
        notes.textContent = 'Notes: ' + project.projectNotes;
        projectItem.appendChild(notes);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            // Delete the project from Firestore
            deleteProject(project.id);
        });
        projectItem.appendChild(deleteButton);

        // Append project item to project list
        projectList.appendChild(projectItem);
    });
}



// Function to show edit form with project details pre-filled
function showEditForm(project) {
    // Hide the display-projects section
    document.getElementById('display-projects').style.display = 'none';

    // Show edit project form
    const editProjectForm = document.getElementById('edit-project-form');
    editProjectForm.style.display = 'block';

    // Fill edit form fields with project details
    document.getElementById('edit-project-name').value = project.projectName;
    document.getElementById('edit-project-description').value = project.projectDescription;
    document.getElementById('edit-project-status').value = project.projectStatus;
    document.getElementById('edit-project-date').value = project.projectDate;
    document.getElementById('edit-project-links').value = project.projectLinks;
    document.getElementById('edit-project-notes').value = project.projectNotes;

    // Clear existing media inputs and media list
    const mediaInputsContainer = document.getElementById('edit-media-inputs-container');
    mediaInputsContainer.innerHTML = ''; // Clear existing media inputs

    // Create the media list
    const mediaListEdit = document.createElement('ul');
    mediaListEdit.id = 'media-list-edit';
    mediaListEdit.classList.add('media-list');

    // Populate media list with existing media URLs
    if (Array.isArray(project.projectMedia) && project.projectMedia.length > 0) {
        project.projectMedia.forEach((mediaURL, index) => {
            const mediaItem = document.createElement('li');

            // Display media URL text
            const mediaLink = document.createElement('span');
            mediaLink.textContent = shortenURL(mediaURL); // Shorten the URL if needed
            mediaItem.appendChild(mediaLink);

            // Create delete button/icon
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-media-btn'); // Add a class for styling
            deleteButton.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent the default behavior of the delete button
                // Remove media item from the list
                removeMediaItem(mediaItem);
            });
            mediaItem.appendChild(deleteButton);

            // Append media item to media list
            mediaListEdit.appendChild(mediaItem);
        });
    }


    // Append media list to media inputs container
    mediaInputsContainer.appendChild(mediaListEdit);
}



// Function to populate the date picker with the specified date
function populateDatePicker(dateString) {
    const datePicker = document.getElementById('edit-project-date');
    if (datePicker) {
        const [year, month, day] = dateString.split('-'); // Split the date string into year, month, and day components
        datePicker.value = `${year}-${month}-${day}`; // Set the value of the date picker
    } else {
        console.error('Date picker element not found');
    }
}



// Call the function to populate the date picker when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Call the function to display the Edit Education section
    displayEditEducation();

    // Populate the date picker with the specified date (e.g., "2024-05-30")
    const projectDate = "2024-05-30"; // Replace this with your actual project date from Firestore
    populateDatePicker(projectDate);
});



// Function to delete project from Firestore
function deleteProject(projectId) {
    const uid = localStorage.getItem('uid');
    if (!uid) {
        console.error('User ID not found in local storage');
        return;
    }

    // Delete project from Firestore
    firestore.collection('users').doc(uid)
        .collection('PersonalPage').doc('PersonalPageID')
        .collection('Projects').doc(projectId).delete()
        .then(() => {
            console.log('Project deleted successfully');
            // Refresh project list
            fetchProjects();
        })
        .catch((error) => {
            console.error('Error deleting project: ', error);
        });
}

// Fetch projects from Firestore
function fetchProjects() {
    const uid = localStorage.getItem('uid');
    if (!uid) {
        console.error('User ID not found in local storage');
        return;
    }

    firestore.collection('users').doc(uid)
        .collection('PersonalPage').doc('PersonalPageID')
        .collection('Projects').get()
        .then((querySnapshot) => {
            const projects = [];
            querySnapshot.forEach((doc) => {
                projects.push({ id: doc.id, ...doc.data() });
            });
            // Display projects
            displayProjects(projects);
        })
        .catch((error) => {
            console.error('Error fetching projects: ', error);
        });
}


// Function to update project details in Firestore
function updateProject(projectId) {
    // Get the updated values from the edit form inputs
    const updatedProjectName = document.getElementById('edit-project-name').value;
    const updatedProjectDescription = document.getElementById('edit-project-description').value;
    const updatedProjectStatus = document.getElementById('edit-project-status').value;
    const markedMediaItems = document.querySelectorAll('.marked-for-deletion');
    deleteMarkedMediaFromFirestore(projectId, markedMediaItems);
    const updatedProjectMedia = []; // Initialize an empty array for project media

    // Get the project media URLs from the form input
    const mediaInputs = document.getElementById('edit-project-media').files;
    for (let i = 0; i < mediaInputs.length; i++) {
        updatedProjectMedia.push(mediaInputs[i].value); // Push each media URL to the array
    }

    const updatedProjectLinks = document.getElementById('edit-project-links').value;
    const updatedProjectDate = document.getElementById('edit-project-date').value;
    const updatedProjectNotes = document.getElementById('edit-project-notes').value;

    // Get the user ID from local storage
    const uid = localStorage.getItem('uid');
    if (!uid) {
        console.error('User ID not found in local storage');
        return;
    }

    // Update the project details in Firestore
    firestore.collection('users').doc(uid).collection('PersonalPage').doc('PersonalPageID').collection('Projects').doc(projectId).update({
        projectName: updatedProjectName,
        projectDescription: updatedProjectDescription,
        projectStatus: updatedProjectStatus,
        projectMedia: updatedProjectMedia,
        projectLinks: updatedProjectLinks,
        projectDate: updatedProjectDate,
        projectNotes: updatedProjectNotes
    })
    .then(() => {
        console.log('Project updated successfully');
        // Optionally, you can display a success message or refresh the project list
        // Show the display-projects section again
        document.getElementById('display-projects').style.display = 'block';
    })
    .catch((error) => {
        console.error('Error updating project: ', error);
    });
}




// Function to delete media URL from Firestore array
function deleteMediaFromFirestore(projectId, mediaIndex) {
    // Get the user ID from local storage
    const uid = localStorage.getItem('uid');
    if (!uid) {
        console.error('User ID not found in local storage');
        return;
    }

    // Remove the media URL from the array in Firestore
    firestore.collection('users').doc(uid)
        .collection('PersonalPage').doc('PersonalPageID')
        .collection('Projects').doc(projectId)
        .update({
            projectMedia: firebase.firestore.FieldValue.arrayRemove(project.projectMedia[mediaIndex])
        })
        .then(() => {
            console.log('Media deleted successfully');
            // Refresh project list
            fetchProjects();
        })
        .catch((error) => {
            console.error('Error deleting media: ', error);
        });
}

// Function to shorten URL (you can implement your own logic here)
function shortenURL(url) {
    // Example implementation: return the first 20 characters of the URL
    return url.substring(0, 20) + '...';
}

// Function to add a new media input to the edit project form
function addMediaInputToEditForm() {
    const mediaInputsContainer = document.getElementById('edit-media-inputs-container');

    // Create a new file input element
    const newMediaInput = document.createElement('input');
    newMediaInput.type = 'file';
    newMediaInput.classList.add('media-upload');
    newMediaInput.accept = 'image/*, video/*';

    // Append the new input to the container
    mediaInputsContainer.appendChild(newMediaInput);
}

// Add event listener to the "Add Another Media" button in the edit project form
const addMediaBtnEdit = document.getElementById('add-media-btn-edit');
addMediaBtnEdit.addEventListener('click', addMediaInputToEditForm);

function removeMediaItem(mediaItem) {
    mediaItem.remove(); // Remove the media item from the HTML list
    mediaItem.classList.add('marked-for-deletion');
}


// Function to handle deleting marked media items from Firestore
function deleteMarkedMediaFromFirestore(projectId, mediaItems) {
    mediaItems.forEach(mediaItem => {
        const index = Array.from(mediaItem.parentNode.children).indexOf(mediaItem); // Get index of media item
        deleteMediaFromFirestore(projectId, index); // Delete media URL from Firestore
    });
}

// Call fetchProjects() to display projects when the page loads
fetchProjects();