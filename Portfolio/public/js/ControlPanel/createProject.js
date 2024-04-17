// Function to handle form submission
async function handleFormSubmission(e) {
    e.preventDefault(); // Prevent the default form submission behavior

    // Get the values from the form inputs
    const projectName = document.getElementById('project-name').value;
    const projectDescription = document.getElementById('project-description').value;
    const projectLinks = document.getElementById('project-links').value;
    const projectStatus = document.getElementById('project-status').value;
    const projectDate = document.getElementById('project-date').value;
    const projectNotes = document.getElementById('project-notes').value;

    // Get all media inputs
    const mediaInputs = document.querySelectorAll('.media-upload');

    // Array to store the media download URLs
    const mediaDownloadURLs = [];

    // Function to upload a single media file to Firebase Storage
    const uploadMediaFile = async (file) => {
        const storageRef = firebase.storage().ref();
        const fileRef = storageRef.child(`project_media/${file.name}`);
        await fileRef.put(file);
        const downloadURL = await fileRef.getDownloadURL();
        mediaDownloadURLs.push(downloadURL);
    };

    // Upload each media file to Firebase Storage
    await Promise.all(Array.from(mediaInputs).map(async mediaInput => {
        const files = mediaInput.files;
        for (const file of files) {
            await uploadMediaFile(file);
        }
    }));

    // Add the project details to Firestore
    const uid = localStorage.getItem('uid');
    if (!uid) {
        console.error('User ID not found in local storage');
        return; // Exit the function if user ID is not found
    }

    const personalPageRef = firestore.collection('users').doc(uid).collection('PersonalPage').doc('PersonalPageID');

    // Check if the "Projects" subcollection exists, if not, create it
    const projectsRef = personalPageRef.collection('Projects');
    const projectsQuery = await projectsRef.limit(1).get();

    if (projectsQuery.empty) {
        // "Projects" subcollection does not exist, create it
        await projectsRef.add({});
    }

    // Add the project details to Firestore
    await personalPageRef.collection('Projects').add({
        projectName: projectName,
        projectDescription: projectDescription,
        projectMedia: mediaDownloadURLs,
        projectLinks: projectLinks,
        projectStatus: projectStatus,
        projectDate: projectDate,
        projectNotes: projectNotes
    }).then((docRef) => {
        console.log('Project added with ID: ', docRef.id);
        // Optionally, you can redirect the user or display a success message
    }).catch((error) => {
        console.error('Error adding project: ', error);
    });
}


// Get a reference to the create project form
const createProjectForm = document.getElementById('create-project-form');

// Add an event listener to the form submit event
createProjectForm.addEventListener('submit', handleFormSubmission);

// Function to add a new media input
function addMediaInput() {
    const mediaInputsContainer = document.getElementById('media-inputs-container');

    // Create a new file input element
    const newMediaInput = document.createElement('input');
    newMediaInput.type = 'file';
    newMediaInput.classList.add('media-upload');
    newMediaInput.accept = 'image/*, video/*';

    // Append the new input to the container
    mediaInputsContainer.appendChild(newMediaInput);
}

// Add event listener to the "Add Another Media" button
const addMediaBtn = document.getElementById('add-media-btn');
addMediaBtn.addEventListener('click', addMediaInput);


