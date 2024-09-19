document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.querySelector('.menu-toggle');
    const myLinks = document.getElementById('myLinks');

    menuToggle.addEventListener('click', function () {
        myLinks.classList.toggle('show');
    });

    const rssFeedUrl = "https://feeds.feedburner.com/brisbanetimes/uKmh0BzaZDA";
    const rss2jsonApiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssFeedUrl)}`;

    fetch(rss2jsonApiUrl)
        .then(response => response.json())
        .then(data => {
            let rssFeedContainer = document.getElementById("rss-feed");
            let output = '<ul>';

            data.items.slice(0, 6).forEach(item => { // Fetching 6 items for example
                let date = new Date(item.pubDate).toLocaleDateString();
                let imageUrl = item.enclosure ? item.enclosure.link : '';

                output += `
                    <li>
                        ${imageUrl ? `<img src="${imageUrl}" alt="${item.title}">` : ''}
                        <div>
                            <a href="${item.link}" target="_blank">${item.title}</a>
                            <p>Published on ${date}</p>
                            <p>${item.description}</p>
                        </div>
                    </li>
                `;
            });

            output += '</ul>';
            rssFeedContainer.innerHTML = output;
        })
        .catch(error => {
            console.error("Error fetching the RSS feed:", error);
            let rssFeedContainer = document.getElementById("rss-feed");
            rssFeedContainer.innerHTML = "<p>Error loading the latest news. Please try again later.</p>";
        });

    const eventsSection = document.getElementById("events-section");
    const eventsCount = eventsSection.getAttribute("data-events-count") || 6;
    const eventsApiUrl = `https://viabrisbane-events.syanix.workers.dev?limit=${eventsCount}`;
    
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
