// Function to display personal details
function displayPersonalDetails(personalDetails) {
    // Populate personal details section with data
    document.getElementById('full-name').textContent = personalDetails.fullName;
    document.getElementById('age').textContent = personalDetails.age;
    document.getElementById('country').textContent = personalDetails.country;
    document.getElementById('city').textContent = personalDetails.city;
    document.getElementById('email').textContent = personalDetails.email;
    document.getElementById('bio').textContent = personalDetails.bio;
    document.getElementById('work-status').textContent = personalDetails.workstatus;

    // Display lists of Skills, Education, Certificates, and Social Links
    displayLists('skills', personalDetails.skills);
    displayLists('education', personalDetails.education);
    displayLists('certificates', personalDetails.certificates);
    displayLists('social-links', personalDetails.socialMedia);
    displayWorkHistory(personalDetails.workHistory); // Display work history

    // Update profile photo
    const profilePhoto = document.querySelector('.profile-photo');
    if (personalDetails.profilePhotoLink) {
        profilePhoto.src = personalDetails.profilePhotoLink;
        profilePhoto.alt = "Profile Photo";
    } else {
        // Set a default profile photo if link is not available
        profilePhoto.src = "images/default-profile-photo.png";
        profilePhoto.alt = "Default Profile Photo";
    }

    // Update banner image
    const bannerDiv = document.querySelector('.banner');
    if (personalDetails.bannerImageLink) {
        bannerDiv.style.backgroundImage = `url(${personalDetails.bannerImageLink})`;
    } else {
        // Set a default banner image if link is not available
        bannerDiv.style.backgroundImage = "url('images/default-banner.png')";
    }

    // Display portfolio introduction text
    const introductionParagraph = document.querySelector('#introduction p');
    if (personalDetails.portfolioIntroText) {
        introductionParagraph.textContent = personalDetails.portfolioIntroText;
    } else {
        // Set a default text if portfolioIntroText is not available
        introductionParagraph.textContent = "Welcome to my portfolio website! Here you can find information about my professional work and the services I offer. Explore my projects and learn more about my approach to solving problems.";
    }
}





// Function to display work history
function displayWorkHistory(workHistory) {
    const container = document.getElementById('work-history'); // Get the container element

    // Clear the container first
    container.innerHTML = '';

    // Check if work history exists
    if (workHistory && workHistory.length > 0) {
        // Iterate over each work history entry and create list items
        workHistory.forEach(entry => {
            const listItem = document.createElement('li');

            // Create a div for the title and company
            const titleCompanyDiv = document.createElement('div');
            const titleElement = document.createElement('strong');
            const companyElement = document.createElement('em');
            titleElement.textContent = entry.title;
            companyElement.textContent = entry.company;
            titleCompanyDiv.appendChild(titleElement);
            titleCompanyDiv.appendChild(document.createTextNode(' at '));
            titleCompanyDiv.appendChild(companyElement);
            listItem.appendChild(titleCompanyDiv);

            // Create a div for the duration
            const durationDiv = document.createElement('div');
            durationDiv.textContent = `Duration: ${entry.duration}`;
            listItem.appendChild(durationDiv);

            container.appendChild(listItem);
        });
    } else {
        // If no work history found, display a message
        container.innerHTML = '<li>No work history available</li>';
    }
}





// Function to display list items for each item of Skills, Education, Certificates, and Social Links
function displayLists(listType, items) {
    const container = document.querySelector(`#${listType}`); // Get the container element

    // Clear the container first
    container.innerHTML = '';

    // Check if items exist
    if (items && items.length > 0) {
        // Iterate over each item and create list items
        items.forEach(item => {
            const listItem = document.createElement('li');
            
            if (listType === 'social-links') {
                // For social links, create <a> tags
                const link = document.createElement('a');
                link.href = item; // Assuming item contains the URL
                link.textContent = item; // Displaying the URL as text
                listItem.appendChild(link);
            } else {
                // For other lists, create regular list items
                listItem.textContent = item;
            }
            
            container.appendChild(listItem);
        });
    } else {
        // If no items found, display a message
        container.innerHTML = '<li>No items found</li>';
    }
}




// Fetch personal details from Firestore
function fetchPersonalDetails() {
    let uid = localStorage.getItem('uid'); // Default to stored UID

    // Extract UID from URL if available
    const urlParams = new URLSearchParams(window.location.search);
    const urlUid = urlParams.get('uid');
    if (urlUid) {
        uid = urlUid;
    }

    if (!uid) {
        console.error('User ID not found in local storage or URL');
        return;
    }

    firestore.collection('users').doc(uid)
        .collection('PersonalPage').doc('PersonalPageID').get()
        .then((doc) => {
            if (doc.exists) {
                // Personal details found, display them
                const personalDetails = doc.data();
                // Replace email in footer
                const footerEmail = document.querySelector('footer p a');
                if (personalDetails.email) {
                    footerEmail.textContent = personalDetails.email;
                    footerEmail.href = 'mailto:' + personalDetails.email;
                }
                displayPersonalDetails(personalDetails);
            } else {
                console.log("Personal details not found");
            }
        })
        .catch((error) => {
            console.error('Error fetching personal details: ', error);
        });
}



// Call fetchPersonalDetails() to display personal details when the page loads
fetchPersonalDetails();
