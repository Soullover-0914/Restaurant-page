// Smooth scrolling for navigation links (only applies to internal anchors on the same page)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        // Check if the link is an internal anchor on the same page
        const targetId = this.getAttribute('href');
        if (targetId.startsWith('#')) {
            e.preventDefault(); // Prevent default only for internal anchors

            const targetElement = document.querySelector(targetId);
            // Only attempt to scroll if the target element exists on the current page
            if (targetElement) {
                const headerOffset = document.querySelector('header').offsetHeight; // Get header height
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Menu filtering logic (relevant only for menu.html)
// This code will only execute if the elements exist on the page
const filterButtons = document.querySelectorAll('.filter-button');
const menuItems = document.querySelectorAll('.menu-item-card');

if (filterButtons.length > 0 && menuItems.length > 0) {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to the clicked button
            button.classList.add('active');

            const category = button.dataset.category;

            menuItems.forEach(item => {
                if (category === 'all' || item.dataset.category === category) {
                    item.style.display = 'block'; // Show item
                } else {
                    item.style.display = 'none'; // Hide item
                }
            });
        });
    });

    // Initialize with 'All' category active
    document.querySelector('.filter-button[data-category="all"]').click();
}


// Reservation Form Submission (Main Section - relevant for reservation.html)
const reservationForm = document.getElementById('reservationForm');
const confirmationMessage = document.getElementById('confirmationMessage');

if (reservationForm && confirmationMessage) {
    reservationForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent default form submission

        // In a real application, you would send this data to a backend server
        const formData = new FormData(reservationForm);
        const reservationDetails = {};
        for (let [key, value] of formData.entries()) {
            reservationDetails[key] = value;
        }

        console.log('Reservation Details (Main Form):', reservationDetails);

        // Show confirmation message
        confirmationMessage.style.display = 'block';
        reservationForm.reset(); // Clear the form
        // Hide message after a few seconds
        setTimeout(() => {
            confirmationMessage.style.display = 'none';
        }, 5000);
    });
}


// Modal Logic (relevant for index.html and reservation.html where the modal is directly used)
const reservationModal = document.getElementById('reservationModal');
const bookTableBtn = document.getElementById('bookTableBtn'); // This button is only on index.html
const bookEventBtn = document.getElementById('bookEventBtn'); // New: Button for Upcoming Events on reservation.html
const closeButton = document.querySelector('.close-button');
const modalReservationForm = document.getElementById('modalReservationForm');
const modalConfirmationMessage = document.getElementById('modalConfirmationMessage');

// Open modal when "Book a Table" button is clicked (if it exists)
if (bookTableBtn) {
    bookTableBtn.addEventListener('click', () => {
        if (reservationModal) {
            reservationModal.style.display = 'flex'; // Use flex to center the modal
        }
    });
}

// New: Open modal when "Book for Upcoming Events" button is clicked (if it exists)
if (bookEventBtn) {
    bookEventBtn.addEventListener('click', () => {
        if (reservationModal) {
            reservationModal.style.display = 'flex'; // Use flex to center the modal
        }
    });
}

// Close modal when close button is clicked (if modal exists)
if (closeButton && reservationModal) {
    closeButton.addEventListener('click', () => {
        reservationModal.style.display = 'none';
        if (modalConfirmationMessage) modalConfirmationMessage.style.display = 'none'; // Hide confirmation if open
        if (modalReservationForm) modalReservationForm.reset(); // Reset form
    });
}

// Close modal when clicking outside the modal content (if modal exists)
if (reservationModal) {
    window.addEventListener('click', (event) => {
        if (event.target == reservationModal) {
            reservationModal.style.display = 'none';
            if (modalConfirmationMessage) modalConfirmationMessage.style.display = 'none'; // Hide confirmation if open
            if (modalReservationForm) modalReservationForm.reset(); // Reset form
        }
    });
}


// Reservation Form Submission (Modal - relevant for any page where the modal is used)
if (modalReservationForm && modalConfirmationMessage && reservationModal) {
    modalReservationForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent default form submission

        // In a real application, you would send this data to a backend server
        const formData = new FormData(modalReservationForm);
        const reservationDetails = {};
        for (let [key, value] of formData.entries()) {
            reservationDetails[key] = value;
        }

        console.log('Reservation Details (Modal Form):', reservationDetails);

        // Show confirmation message
        modalConfirmationMessage.style.display = 'block';
        modalReservationForm.reset(); // Clear the form
        // Optionally, close modal after a delay or user interaction
        setTimeout(() => {
            reservationModal.style.display = 'none';
            modalConfirmationMessage.style.display = 'none';
        }, 5000); // Close modal after 5 seconds
    });
}


// Map Interaction Logic (relevant only for location.html)
const interactiveMap = document.getElementById('interactiveMap');
const mapImage = interactiveMap ? interactiveMap.querySelector('.map-image') : null;

if (interactiveMap && mapImage) {
    let isDragging = false;
    let startX, startY;
    let initialLeft, initialTop;

    interactiveMap.addEventListener('mousedown', (e) => {
        isDragging = true;
        interactiveMap.style.cursor = 'grabbing';
        startX = e.clientX;
        startY = e.clientY;
        // Get current position of the mapImage relative to its parent (map-container)
        // Use computed style or current inline style
        initialLeft = parseFloat(mapImage.style.left) || -25; // Default to -25% if not set
        initialTop = parseFloat(mapImage.style.top) || -25; // Default to -25% if not set
        e.preventDefault(); // Prevent default drag behavior
    });

    interactiveMap.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        // Calculate new position in pixels first, then convert to percentage
        // The map-image is 150% of its container's width/height
        const containerWidth = interactiveMap.offsetWidth;
        const containerHeight = interactiveMap.offsetHeight;
        const imageRenderedWidth = containerWidth * 1.5; // map-image is 150% of container
        const imageRenderedHeight = containerHeight * 1.5;

        // Convert current % left/top to pixels for calculation
        let currentLeftPx = (initialLeft / 100) * imageRenderedWidth;
        let currentTopPx = (initialTop / 100) * imageRenderedHeight;

        let newLeftPx = currentLeftPx + dx;
        let newTopPx = currentTopPx + dy;

        // Define boundaries in pixels relative to the map-container's top-left corner
        // The image can move from 0 (left edge of image at left edge of container)
        // to -(imageRenderedWidth - containerWidth) (right edge of image at right edge of container)
        const minLeftPx = -(imageRenderedWidth - containerWidth);
        const minTopPx = -(imageRenderedHeight - containerHeight);
        const maxLeftPx = 0;
        const maxTopPx = 0;

        // Apply boundaries
        newLeftPx = Math.max(minLeftPx, Math.min(maxLeftPx, newLeftPx));
        newTopPx = Math.max(minTopPx, Math.min(maxTopPx, newTopPx));

        // Convert back to percentage relative to the image's own size for style
        // This is crucial: mapImage.style.left/top is relative to the image's own dimensions.
        // It's effectively how much of the image is "cut off" from the left/top.
        // Example: if image is 150px and container is 100px, and you want to show the right 100px,
        // you set left to -50px. -50px / 150px * 100% = -33.33%.
        mapImage.style.left = `${(newLeftPx / imageRenderedWidth) * 100}%`;
        mapImage.style.top = `${(newTopPx / imageRenderedHeight) * 100}%`;

        // Update start positions for next move
        startX = e.clientX;
        startY = e.clientY;
        initialLeft = parseFloat(mapImage.style.left);
        initialTop = parseFloat(mapImage.style.top);
    });

    interactiveMap.addEventListener('mouseup', () => {
        isDragging = false;
        interactiveMap.style.cursor = 'grab';
    });

    interactiveMap.addEventListener('mouseleave', () => {
        isDragging = false;
        interactiveMap.style.cursor = 'grab';
    });
}
