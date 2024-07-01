document.addEventListener('DOMContentLoaded', (event) => {
    const toggle = document.getElementById('darkModeToggle');
    const navbar = document.querySelector('.navbar');
    const navbarLogo = document.getElementById('navbar-logo');

    // Check localStorage for dark mode setting
    if (localStorage.getItem('darkMode') === 'enabled') {
        enableDarkMode(navbar, navbarLogo);
    } else {
        disableDarkMode(navbar, navbarLogo);
    }

    if (toggle) {
        toggle.addEventListener('click', () => {
            if (document.body.classList.contains('dark-mode')) {
                disableDarkMode(navbar, navbarLogo);
            } else {
                enableDarkMode(navbar, navbarLogo);
            }
        });
    }
});

function enableDarkMode(navbar, navbarLogo) {
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
    navbar.classList.remove('navbar-light', 'bg-light');
    navbar.classList.add('navbar-dark', 'bg-dark');
    navbarLogo.src = navbarLogo.getAttribute('data-dark-logo');
    localStorage.setItem('darkMode', 'enabled');
}

function disableDarkMode(navbar, navbarLogo) {
    document.body.classList.remove('dark-mode');
    document.body.classList.add('light-mode');
    navbar.classList.remove('navbar-dark', 'bg-dark');
    navbar.classList.add('navbar-light', 'bg-light');
    navbarLogo.src = navbarLogo.getAttribute('data-light-logo');
    localStorage.setItem('darkMode', 'disabled');
}

function addVisit() {
    const visitInput = document.getElementById('visit');
    const visitList = document.getElementById('visit-list');
    const hiddenInput = document.getElementById('visit-hidden');

    if (visitInput.value.trim() !== "") {
        const newVisit = document.createElement('div');
        newVisit.className = 'mb-2';
        newVisit.innerHTML = `${visitInput.value} <button type="button" class="btn btn-danger btn-sm" onclick="removeItem(this, 'visit-hidden')">Remove</button>`;

        visitList.appendChild(newVisit);
        hiddenInput.value += visitInput.value + ",";
        visitInput.value = "";
    }
}

function addEat() {
    const eatInput = document.getElementById('eat');
    const eatList = document.getElementById('eat-list');
    const hiddenInput = document.getElementById('eat-hidden');

    if (eatInput.value.trim() !== "") {
        const newEat = document.createElement('div');
        newEat.className = 'mb-2';
        newEat.innerHTML = `${eatInput.value} <button type="button" class="btn btn-danger btn-sm" onclick="removeItem(this, 'eat-hidden')">Remove</button>`;

        eatList.appendChild(newEat);
        hiddenInput.value += eatInput.value + ",";
        eatInput.value = "";
    }
}

function removeItem(button, hiddenInputId) {
    const hiddenInput = document.getElementById(hiddenInputId);
    const itemText = button.parentNode.innerText.replace(' Remove', '');
    hiddenInput.value = hiddenInput.value.replace(itemText + ',', '');
    button.parentNode.remove();
}

function selectDate(date, cardElement) {
    document.getElementById('date').value = formatDateForInput(date);
    if (tripDetails[date]) {
        document.getElementById('travel').value = tripDetails[date]['travel'];
        document.getElementById('stay').value = tripDetails[date]['stay'];
        document.getElementById('visit-hidden').value = tripDetails[date]['visit'].join(',');
        document.getElementById('eat-hidden').value = tripDetails[date]['eat'].join(',');

        const visitList = document.getElementById('visit-list');
        const eatList = document.getElementById('eat-list');

        visitList.innerHTML = '<input type="text" class="form-control mb-2" id="visit" placeholder="Add a place to visit"><button type="button" class="btn btn-primary mb-2" onclick="addVisit()">Add</button>';
        eatList.innerHTML = '<input type="text" class="form-control mb-2" id="eat" placeholder="Add a place to eat"><button type="button" class="btn btn-primary mb-2" onclick="addEat()">Add</button>';

        tripDetails[date]['visit'].forEach(function(item) {
            const newVisit = document.createElement('div');
            newVisit.className = 'mb-2';
            newVisit.innerHTML = `${item} <button type="button" class="btn btn-danger btn-sm" onclick="removeItem(this, 'visit-hidden')">Remove</button>`;
            visitList.appendChild(newVisit);
        });

        tripDetails[date]['eat'].forEach(function(item) {
            const newEat = document.createElement('div');
            newEat.className = 'mb-2';
            newEat.innerHTML = `${item} <button type="button" class="btn btn-danger btn-sm" onclick="removeItem(this, 'eat-hidden')">Remove</button>`;
            eatList.appendChild(newEat);
        });
    } else {
        document.getElementById('travel').value = '';
        document.getElementById('stay').value = '';
        document.getElementById('visit-hidden').value = '';
        document.getElementById('eat-hidden').value = '';
    }

    // Provide visual feedback for the selected card
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.classList.remove('card-selected');
        card.classList.remove('card-selected-dark');
    });

    if (document.body.classList.contains('dark-mode')) {
        cardElement.classList.add('card-selected-dark');
    } else {
        cardElement.classList.add('card-selected');
    }
}

function formatDateForInput(date) {
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`;
}

function formatDateForDisplay(date) {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
}

function handleFormSubmit(event) {
    event.preventDefault();  // Prevent the form from submitting and refreshing the page

    const dateInput = document.getElementById('date');
    const formattedDate = formatDateForDisplay(dateInput.value);
    dateInput.value = formattedDate;

    const visitHiddenInput = document.getElementById('visit-hidden');
    const eatHiddenInput = document.getElementById('eat-hidden');

    if (!visitHiddenInput.value) {
        visitHiddenInput.value = '';
    }

    if (!eatHiddenInput.value) {
        eatHiddenInput.value = '';
    }

    console.log("Date:", dateInput.value);  // Debugging line
    console.log("Travel:", document.getElementById('travel').value);  // Debugging line
    console.log("Stay:", document.getElementById('stay').value);  // Debugging line
    console.log("Visit:", visitHiddenInput.value);  // Debugging line
    console.log("Eat:", eatHiddenInput.value);  // Debugging line

    // Convert the date back to yyyy-MM-dd before submission
    dateInput.value = formatDateForInput(formattedDate);
    console.log("Date (final submission format):", dateInput.value);  // Debugging line

    // Now manually submit the form
    document.getElementById('trip-form').submit();
}

document.querySelector('form').addEventListener('submit', handleFormSubmit);
