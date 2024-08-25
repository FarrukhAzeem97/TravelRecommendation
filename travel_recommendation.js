// Path to your JSON file
const jsonFilePath = 'travel_recommendation_api.json';

// Function to fetch data from the JSON file
async function fetchTravelData() {
    try {
        const response = await fetch(jsonFilePath);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

// Function to search and display results based on the keyword
async function searchRecommendations() {
    // Fetch the travel data
    const data = await fetchTravelData();

    // Get the search keyword and convert it to lowercase
    const searchInput = document.getElementById('search-input').value.toLowerCase();

    // Container to display search results
    const container = document.getElementById('recommendations-container');
    container.innerHTML = '';  // Clear previous results

    // Check if data is available
    if (data && searchInput) {
        let found = false;

        // Search through countries
        data.countries.forEach(country => {
            const countryName = country.name.toLowerCase();
            if (countryName.includes(searchInput)) {
                displayCountry(country, container);
                found = true;
            }

            country.cities.forEach(city => {
                const cityName = city.name.toLowerCase();
                if (cityName.includes(searchInput)) {
                    displayCity(city, container);
                    found = true;
                }
            });
        });

        // Search through temples
        data.temples.forEach(temple => {
            const templeName = temple.name.toLowerCase();
            if (templeName.includes(searchInput)) {
                displayTemple(temple, container);
                found = true;
            }
        });

        // Search through beaches
        data.beaches.forEach(beach => {
            const beachName = beach.name.toLowerCase();
            if (beachName.includes(searchInput)) {
                displayBeach(beach, container);
                found = true;
            }
        });

        // If no results found
        if (!found) {
            container.innerHTML = '<p>No results found for your search.</p>';
        }
    } else {
        container.innerHTML = '<p>Please enter a search term.</p>';
    }
}

// Functions to display each category
function displayCountry(country, container) {
    const countryElement = document.createElement('div');
    countryElement.classList.add('country');
    countryElement.innerHTML = `<h2>${country.name}</h2>`;
    container.appendChild(countryElement);
}

function displayCity(city, container) {
    const cityElement = document.createElement('div');
    cityElement.classList.add('city');
    cityElement.innerHTML = `
        <h3>${city.name}</h3>
        <img src="${city.imageUrl}" alt="${city.name}">
        <p>${city.description}</p>
    `;
    container.appendChild(cityElement);
}

function displayTemple(temple, container) {
    const templeElement = document.createElement('div');
    templeElement.classList.add('temple');
    templeElement.innerHTML = `
        <h3>${temple.name}</h3>
        <img src="${temple.imageUrl}" alt="${temple.name}">
        <p>${temple.description}</p>
    `;
    container.appendChild(templeElement);
}

function displayBeach(beach, container) {
    const beachElement = document.createElement('div');
    beachElement.classList.add('beach');
    beachElement.innerHTML = `
        <h3>${beach.name}</h3>
        <img src="${beach.imageUrl}" alt="${beach.name}">
        <p>${beach.description}</p>
    `;
    container.appendChild(beachElement);
}
function getLocalTime(timeZone) {
    const options = {
        timeZone: timeZone,
        hour12: true,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    };
    return new Date().toLocaleTimeString('en-US', options);
}
const timeZones = {
    "Australia": "Australia/Sydney",
    "Japan": "Asia/Tokyo",
    "Brazil": "America/Sao_Paulo",
    "New York": "America/New_York"  // Example for additional city
};
function displayRecommendations(keyword) {
    // Normalize the keyword to lowercase
    const normalizedKeyword = keyword.toLowerCase();

    let recommendations = [];
    
    // Match the keyword with the appropriate section in your data
    if (normalizedKeyword.includes('beach')) {
        recommendations = travelData.beaches;
    } else if (normalizedKeyword.includes('temple')) {
        recommendations = travelData.temples;
    } else if (normalizedKeyword.includes('country')) {
        recommendations = travelData.countries;
    }

    // Display the recommendations and local time
    const recommendationsContainer = document.getElementById('recommendations');
    recommendationsContainer.innerHTML = ''; // Clear previous recommendations
    
    recommendations.forEach(recommendation => {
        const locationTime = getLocalTime(timeZones[recommendation.name.split(',')[1].trim()]);

        recommendationsContainer.innerHTML += `
            <div class="recommendation">
                <img src="${recommendation.imageUrl}" alt="${recommendation.name}">
                <h3>${recommendation.name}</h3>
                <p>${recommendation.description}</p>
                <p><strong>Local Time:</strong> ${locationTime}</p>
            </div>
        `;
    });
}
// Event listener for the search button
document.getElementById('search-button').addEventListener('click', searchRecommendations);
document.getElementById('clear-button').addEventListener('click', function() {
    // Clear the search input field
    document.getElementById('search-input').value = '';

    // Clear the recommendations container
    const container = document.getElementById('recommendations-container');
    if (container) {
        container.innerHTML = '';

        // Optionally, show the recommendations container again
        container.style.display = 'block';
    } else {
        console.error('Recommendations container not found.');
    }
});

