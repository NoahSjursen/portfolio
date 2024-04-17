// Function to fetch projects from Firestore
function fetchProjects() {
    const uid = getUID();
    if (!uid) {
        console.error('User ID not found in local storage');
        return;
    }

    firestore.collection('users').doc(uid).collection('PersonalPage').doc('PersonalPageID').collection('Projects').get()
        .then((querySnapshot) => {
            const projectsOngoing = [];
            const projectsFinished = [];

            const addedProjects = {}; // Object to keep track of added project IDs

            querySnapshot.forEach((doc) => {
                const projectData = doc.data();
                if (!addedProjects[doc.id]) {
                    addedProjects[doc.id] = true; // Mark the project ID as added
                    if (projectData.projectStatus === 'ongoing') {
                        projectsOngoing.push(projectData);
                    } else if (projectData.projectStatus === 'finished') {
                        projectsFinished.push(projectData);
                    }
                }
            });

            // Display projects in their respective sections
            displayProjects(projectsOngoing, 'projects-ongoing');
            displayProjects(projectsFinished, 'projects-finished');
        })
        .catch((error) => {
            console.error('Error fetching projects: ', error);
        });
}

// Function to get the UID from URL or local storage
function getUID() {
    let uid = localStorage.getItem('uid'); // Default to stored UID

    // Extract UID from URL if available
    const urlParams = new URLSearchParams(window.location.search);
    const urlUid = urlParams.get('uid');
    if (urlUid) {
        uid = urlUid;
    }

    return uid;
}

// Function to display projects
function displayProjects(projects, containerId) {
    const projectContainer = document.getElementById(containerId);
    projectContainer.innerHTML = ''; // Clear existing project list

    projects.forEach((project) => {
        const projectItem = createProjectItem(project);
        projectContainer.appendChild(projectItem);
    });
}

function createProjectItem(project) {
    const projectItem = document.createElement('div');
    projectItem.classList.add('project-item');

    // Display project name
    const projectName = document.createElement('h1');
    projectName.textContent = project.projectName;
    projectName.style.textAlign = 'center';
    projectName.style.fontWeight = 'bold';
    projectItem.appendChild(projectName);

    // Display description
    appendProjectDetail(projectItem, 'Description', project.projectDescription, true);

    // Display links
    if (project.projectLinks) {
        const linksContainer = document.createElement('div');
        linksContainer.classList.add('links-container');
        appendProjectDetail(linksContainer, 'Links', project.projectLinks, true);
        projectItem.appendChild(linksContainer);
    }

    // Display notes
    appendProjectDetail(projectItem, 'Notes', project.projectNotes, false);

    // Display project status and completion date
    appendProjectDetail(projectItem, 'Status', project.projectStatus);
    appendProjectDetail(projectItem, 'Completion Date', project.projectDate);

    // Display media as images, videos, or links
    if (project.projectMedia && project.projectMedia.length > 0) {
        const mediaContainer = document.createElement('div');
        mediaContainer.classList.add('media-container');
        project.projectMedia.forEach((mediaURL) => {
            const mediaElement = createMediaElement(mediaURL);
            mediaContainer.appendChild(mediaElement);
        });
        projectItem.appendChild(mediaContainer);
    }

    return projectItem;
}




// Function to append project detail to the project item
function appendProjectDetail(container, label, text) {
    if (!label && !text) return; // Ignore if both label and text are null

    const detail = document.createElement('p');
    if (label) {
        const colonIndex = label.indexOf(':');
        const boldText = colonIndex !== -1 ? label.substring(0, colonIndex + 1) : label;
        const plainText = colonIndex !== -1 ? label.substring(colonIndex + 1) : '';
        detail.innerHTML = '<strong>' + boldText + '</strong>' + plainText;
        detail.style.marginBottom = '5px';
    }
    if (text) {
        detail.innerHTML += '<br>' + text;
    }
    container.appendChild(detail);
}




function createMediaElement(mediaURL) {
    const mediaElement = document.createElement('div');
    mediaElement.classList.add('media-container'); // Add class to the parent container

    // Extract the base URL without any query parameters for accurate file type detection
    const baseUrl = mediaURL.split('?')[0];  // Split the URL at the '?' and take the first part

    // Check if the media is an image
    if (baseUrl.toLowerCase().match(/\.(png|jpg|jpeg|gif)$/)) {
        const imageLink = document.createElement('a'); // Create anchor element
        imageLink.href = mediaURL; // Set href attribute to mediaURL
        imageLink.target = '_blank'; // Open link in new tab
        const imageElement = document.createElement('img');
        imageElement.src = mediaURL;  // Use the original URL with query parameters for actual source
        imageElement.alt = 'Project Media'; // Providing an alt attribute for accessibility
        imageElement.classList.add('project-media'); // Add a class for styling
        imageLink.appendChild(imageElement); // Append image inside anchor element
        mediaElement.appendChild(imageLink); // Append anchor element inside media container
    } 
    // Check if the media is a video
    else if (baseUrl.toLowerCase().endsWith('.mp4')) {
        const videoElement = document.createElement('video');
        videoElement.src = mediaURL;  // Use the original URL with query parameters for actual source
        videoElement.setAttribute('controls', ''); // Add controls to the video
        videoElement.classList.add('project-media'); // Add a class for styling
        mediaElement.appendChild(videoElement);
    } else {
        // If it's neither an image nor a video, assume it's a link to other types of media
        const linkElement = document.createElement('a');
        linkElement.href = mediaURL;
        linkElement.textContent = 'View Media';
        linkElement.target = '_blank'; // Open link in new tab
        linkElement.classList.add('project-media'); // Adding a class for consistency in styling
        mediaElement.appendChild(linkElement);
    }

    return mediaElement;
}














// Call fetchProjects() to display projects when the page loads
fetchProjects();
