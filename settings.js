let settingsLink = document.getElementById("account-info-link")
let settingsDiv = document.getElementById("account-info")
settingsLink.style.color = "#ffcc00"
settingsDiv.style.display = "block"

function changeSettingsDiv(id) {
    settingsLink.style.color = "#ffffff"
    settingsDiv.style.display = "none"
    
    let settingsLinkName = id + "-link"
    settingsLink = document.getElementById(settingsLinkName)

    settingsDiv = document.getElementById(id)
    settingsLink.style.color = "#ffcc00"
    settingsDiv.style.display = "block"
}

