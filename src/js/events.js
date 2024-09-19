document.addEventListener("DOMContentLoaded", function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const myLinks = document.getElementById('myLinks');

    menuToggle.addEventListener('click', function () {
        myLinks.classList.toggle('show');
    });


    const eventsSection = document.getElementById("events-section");
    const eventsCount = eventsSection.getAttribute("data-events-count") || 6;
    const eventsApiUrl = `https://events.data.viabrisbane.com?limit=${eventsCount}`;

    fetch(eventsApiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            let eventsContainer = document.getElementById("events-container");
            let output = '<ul>';

            data.results.forEach(result => {
                const event = result || {};

                // Mapping the provided data fields
                const title = event.subject || 'No Title';
                const description = event.description || 'No Description';
                const truncatedDescription = description.length > 100 ? description.slice(0, 100) + '...' : description;

                output += `
                    <li>
                        <img src="${event.eventimage || 'default-image.jpg'}" alt="${title}">
                        <div>
                            <a href="${event.web_link || '#'}" class="title" target="_blank">${title}</a>
                            <p>Date: ${event.formatteddatetime || 'No Date'}</p>
                            <p>Location: ${event.location || 'No Location'}</p>
                            <p>Cost: ${event.cost || 'Free'}</p>
                            <p>Booking Info: ${event.bookings || 'No booking information available'}</p>
                            <p class="description" data-full-description="${description}">
                                ${truncatedDescription} 
                                <span class="read-more">Read More</span>
                            </p>
                            
                        </div>
                    </li>
                `;
            });

            output += '</ul>';
            eventsContainer.innerHTML = output;

            // Initialize "Read More" functionality
            const readMoreButtons = document.querySelectorAll('.read-more');

            readMoreButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const description = this.parentElement;
                    const fullDescription = description.getAttribute('data-full-description');

                    // Replace the truncated description with the full description
                    description.innerHTML = fullDescription;
                    description.classList.add('expanded'); // Make it fully visible

                    // Remove the "Read More" link after expanding
                    this.style.display = 'none';
                });
            });
        })
        .catch(error => {
            console.error("Error fetching the events data:", error);
            let eventsContainer = document.getElementById("events-container");
            eventsContainer.innerHTML = `<p>Error loading events: ${error.message}</p>`;
        });
});