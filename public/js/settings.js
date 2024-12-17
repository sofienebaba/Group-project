let settingsLink = document.getElementById("account-info-link")
let settingsDiv = document.getElementById("account-info")
settingsLink.style.color = "#ffcc00"
settingsDiv.style.display = "block"

const signOutButton = document.getElementById('signout-button'); // Assuming you have a button with this ID

signOutButton.addEventListener('click', async () => {
    console.log("signing out");
    try {
        const response = await fetch('/api/signout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result = await response.text();
        if (response.ok) {
            window.location.href = 'index.html'; // Redirect to home or login page
        } else {
            alert(result.error || 'Sign Out Failed!');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong!');
    }
});

function changeSettingsDiv(id) {
    settingsLink.style.color = "#ffffff"
    settingsDiv.style.display = "none"
    
    let settingsLinkName = id + "-link"
    settingsLink = document.getElementById(settingsLinkName)

    settingsDiv = document.getElementById(id)
    settingsLink.style.color = "#ffcc00"
    settingsDiv.style.display = "block"
}

function openEditInfo(id) {
    editPanel = document.getElementById(id)
    editPanel.style.display = "block"
}

function saveChanges() {
    editPanel.style.display = "none"
}

function closeModal() {
    editPanel.style.display = "none"
}
