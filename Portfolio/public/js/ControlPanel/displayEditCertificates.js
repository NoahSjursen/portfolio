// Function to display the Edit Certificates section
function displayEditCertificates() {
    // Clear input field
    document.getElementById('certificates').value = '';

    // Get the user ID from local storage
    const uid = localStorage.getItem('uid');
    if (!uid) {
        console.error('User ID not found in local storage');
        return;
    }

    // Reference to the user's PersonalPage document
    const personalPageRef = firestore.collection('users').doc(uid).collection('PersonalPage').doc('PersonalPageID');

    // Get the certificates array from Firestore
    personalPageRef.get()
        .then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                const certificatesArray = data.certificates || []; // Initialize certificates array or use existing array

                // Display certificates list with trash icon
                const certificatesList = document.getElementById('certificates-list');
                certificatesList.innerHTML = ''; // Clear previous list items

                certificatesArray.forEach((certificate, index) => {
                    const listItem = document.createElement('li');
                    listItem.textContent = certificate;

                    // Add trash icon to remove the certificate
                    const trashIcon = document.createElement('i');
                    trashIcon.classList.add('fas', 'fa-trash-alt');
                    trashIcon.addEventListener('click', () => removeCertificate(index));

                    listItem.appendChild(trashIcon);
                    certificatesList.appendChild(listItem);
                });
            } else {
                console.error('PersonalPage document not found');
            }
        })
        .catch((error) => {
            console.error('Error fetching certificates: ', error);
        });
}

// Function to remove a certificate from the certificates array in Firestore
function removeCertificate(index) {
    // Get the user ID from local storage
    const uid = localStorage.getItem('uid');
    if (!uid) {
        console.error('User ID not found in local storage');
        return;
    }

    // Reference to the user's PersonalPage document
    const personalPageRef = firestore.collection('users').doc(uid).collection('PersonalPage').doc('PersonalPageID');

    // Get the current certificates array from Firestore
    personalPageRef.get()
        .then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                let certificatesArray = data.certificates || []; // Initialize certificates array or use existing array

                // Remove the certificate at the specified index
                if (index >= 0 && index < certificatesArray.length) {
                    certificatesArray.splice(index, 1);

                    // Update the certificates field in Firestore
                    return personalPageRef.update({
                        certificates: certificatesArray
                    });
                }
            } else {
                console.error('PersonalPage document not found');
            }
        })
        .then(() => {
            console.log('Certificate removed successfully');
            // Update the displayed certificates list
            displayEditCertificates();
        })
        .catch((error) => {
            console.error('Error removing certificate: ', error);
        });
}

// Event listener for the form submit event
document.addEventListener('DOMContentLoaded', () => {
    // Call the function to display the Edit Certificates section
    displayEditCertificates();

    // Add an event listener to the form submit event
    editCertificatesForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        // Get the value from the certificates input field
        const newCertificate = document.getElementById('certificates').value.trim();

        // Exit if the certificate input is empty
        if (!newCertificate) {
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

        // Update the certificates field in Firestore
        personalPageRef.get()
            .then((doc) => {
                if (doc.exists) {
                    const data = doc.data();
                    let certificatesArray = data.certificates || []; // Initialize certificates array or use existing array

                    // Append the new certificate to the certificates array if it doesn't already exist
                    if (!certificatesArray.includes(newCertificate)) {
                        certificatesArray.push(newCertificate);

                        // Update the certificates field in Firestore
                        return personalPageRef.update({
                            certificates: certificatesArray
                        });
                    }
                } else {
                    console.error('PersonalPage document not found');
                }
            })
            .then(() => {
                console.log('Certificates updated successfully');
                displayEditCertificates();
            })
            .catch((error) => {
                console.error('Error updating certificates: ', error);
            });
    });
});

// Function to hide the edit certificates form
function hideEditForm(formId) {
    document.getElementById(formId).style.display = 'none';
}

// Call the function to display the Edit Certificates section
displayEditCertificates();
