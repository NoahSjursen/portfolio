// editPersonalPage.js

// Function to fetch data from Firestore and populate the form fields
function populatePersonalPageFields() {
    // Get the current user's UID from local storage
    const uid = localStorage.getItem('uid');

    // If UID exists
    if (uid) {
        // Reference to the collection in Firestore
        const personalPageRef = firestore.collection("users").doc(uid).collection("PersonalPage");

        // Get the first document
        personalPageRef.limit(1).get().then((querySnapshot) => {
            if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                    // Populate the form fields with the data from Firestore
                    const data = doc.data();
                    document.getElementById('bio').value = data.bio || '';
                    //document.getElementById('banner-image').value = data.bannerImageLink || '';
                    //document.getElementById('profile-picture').value = data.profilePhotoLink || '';
                    document.getElementById('name').value = data.fullName || '';
                    document.getElementById('age').value = data.age || '';
                    document.getElementById('email').value = data.email || '';
                    document.getElementById('work-status').value = data.workstatus || '';
                    document.getElementById('workplace').value = data.workplace || '';
                    document.getElementById('portfolio-introduction').value = data.portfolioIntroText || '';
                    document.getElementById('country').value = data.country || '';
                    document.getElementById('city').value = data.city || '';
                });
            } else {
                console.log("No such document!");
                // Handle the case where the document is not found
            }
        }).catch((error) => {
            console.log("Error getting documents: ", error);
        });
    } else {
        console.log("No user logged in");
    }
}


async function saveChanges() {
    const uid = localStorage.getItem('uid');
    const personalPageRef = firestore.collection("users").doc(uid).collection("PersonalPage").doc("PersonalPageID");

    // Get form values
    const bio = document.getElementById('bio').value;
    const fullName = document.getElementById('name').value;
    const age = parseInt(document.getElementById('age').value);
    const email = document.getElementById('email').value;
    const workstatus = document.getElementById('work-status').value;
    const workplace = document.getElementById('workplace').value;
    const portfolioIntroText = document.getElementById('portfolio-introduction').value;
    const country = document.getElementById('country').value;
    const city = document.getElementById('city').value;

    // Get the image files
    const bannerImageFile = document.getElementById('banner-image').files[0];
    const profilePhotoFile = document.getElementById('profile-picture').files[0];

    // Get existing banner image and profile photo links from Firestore
    const personalPageDoc = await personalPageRef.get();
    const existingData = personalPageDoc.data() || {}; // Initialize to empty object if no data

    // Upload images to Firebase Storage if files are provided
    let newBannerImageURL = existingData.bannerImageLink || '';
    let newProfilePhotoURL = existingData.profilePhotoLink || '';
    if (bannerImageFile) {
        newBannerImageURL = await uploadImage(bannerImageFile, 'bannerImages');
    }
    if (profilePhotoFile) {
        newProfilePhotoURL = await uploadImage(profilePhotoFile, 'profilePhotos');
    }

    // Construct the data object to be updated in Firestore
    const dataToUpdate = {
        bio: bio,
        fullName: fullName,
        age: age,
        email: email,
        workstatus: workstatus,
        workplace: workplace,
        portfolioIntroText: portfolioIntroText,
        country: country,
        city: city
    };

    // Add banner image URL to data object
    if (newBannerImageURL) {
        dataToUpdate.bannerImageLink = newBannerImageURL;
    }

    // Add profile photo URL to data object
    if (newProfilePhotoURL) {
        dataToUpdate.profilePhotoLink = newProfilePhotoURL;
    }

    // Update specific fields in Firestore document
    personalPageRef.update(dataToUpdate)
        .then(() => {
            console.log("Document successfully updated!");
        })
        .catch((error) => {
            console.error("Error updating document: ", error);
        });
}




// Function to upload an image file to Firebase Storage
async function uploadImage(file, folder) {
    if (!file) return null; // Return null if no file is provided

    // Create a reference to the Firebase Storage location
    const storageRef = firebase.storage().ref();
    const fileRef = storageRef.child(`${folder}/${file.name}`);

    // Upload the file to Firebase Storage
    await fileRef.put(file);

    // Get the download URL for the uploaded file
    return fileRef.getDownloadURL();
}

// Populate form fields when the page loads
document.addEventListener('DOMContentLoaded', function () {
    populatePersonalPageFields();
});

// Save changes when the "Save Changes" button is clicked
document.getElementById('edit-personal-page-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission
    saveChanges();
});

