// кнопка навбара
document.querySelector('.navbar-toggle').addEventListener('click', function() {
    document.querySelector('.header-buttons').classList.toggle('active');
});

// свгшка
window.addEventListener('resize', function() {
    const largeSVG = document.querySelector('.svg-large');
    const smallSVG = document.querySelector('.svg-small');

    if (largeSVG && smallSVG) {
        if (window.innerWidth <= 420) {
            largeSVG.style.display = 'none';
            smallSVG.style.display = 'block';
        } else {
            largeSVG.style.display = 'block';
            smallSVG.style.display = 'none';
        }
    }
});

// Инициализация при загрузке страницы
window.dispatchEvent(new Event('resize'));

document.addEventListener('DOMContentLoaded', (event) => {
    const modal = document.getElementById("customModal");
    const span = document.getElementsByClassName("custom-close-btn")[0];

    // Close the modal
    span.onclick = function() {
        modal.style.display = "none";
        document.body.classList.remove('modal-open');
    }

    // Close the modal when clicking outside of it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            document.body.classList.remove('modal-open');
        }
    }
});

//из html
document.addEventListener('DOMContentLoaded', function() {
    function fetchSuggestions(input, suggestionBox, url) {
        input.addEventListener('input', function() {
            const query = this.value;
            if (query.length > 1) {
                fetch(`${url}?q=${query}`)
                    .then(response => response.json())
                    .then(data => {
                        suggestionBox.innerHTML = '';
                        data.forEach(city => {
                            const div = document.createElement('div');
                            div.textContent = city.name;
                            div.addEventListener('click', function() {
                                input.value = city.name;
                                suggestionBox.innerHTML = '';
                            });
                            suggestionBox.appendChild(div);
                        });
                    });
            } else {
                suggestionBox.innerHTML = '';
            }
        });
    }

    const departureCityInput = document.getElementById('departure-city');
    const departureCitySuggestions = document.getElementById('departure-city-suggestions');
    const departureCityUrl = departureCityInput.getAttribute('data-url');
    fetchSuggestions(departureCityInput, departureCitySuggestions, departureCityUrl);

    const arrivalCityInput = document.getElementById('arrival-city');
    const arrivalCitySuggestions = document.getElementById('arrival-city-suggestions');
    const arrivalCityUrl = arrivalCityInput.getAttribute('data-url');
    fetchSuggestions(arrivalCityInput, arrivalCitySuggestions, arrivalCityUrl);

    const minCostSlider = document.getElementById('min-cost');
    const maxCostSlider = document.getElementById('max-cost');
    const minCostValue = document.getElementById('min-cost-value');
    const maxCostValue = document.getElementById('max-cost-value');
    const sliderTrack = document.querySelector('.slider-track');
    const tripsContainer = document.getElementById('trips-container');
    const maxGap = 50; // Minimum gap between sliders

    function updateSliderValues(event) {
        let minValue = parseInt(minCostSlider.value);
        let maxValue = parseInt(maxCostSlider.value);

        if (maxValue - minValue <= maxGap) {
            if (event.target === minCostSlider) {
                minCostSlider.value = maxValue - maxGap;
            } else {
                maxCostSlider.value = minValue + maxGap;
            }
        }

        minValue = parseInt(minCostSlider.value);
        maxValue = parseInt(maxCostSlider.value);

        minCostValue.value = minValue;
        maxCostValue.value = maxValue;
        fillSlider();
        filterTrips();
    }

    function updateInputValues(event) {
        let minValue = parseInt(minCostValue.value);
        let maxValue = parseInt(maxCostValue.value);

        if (maxValue - minValue <= maxGap) {
            if (event.target === minCostValue) {
                minCostValue.value = maxValue - maxGap;
            } else {
                maxCostValue.value = minValue + maxGap;
            }
        }

        minValue = parseInt(minCostValue.value);
        maxValue = parseInt(maxCostValue.value);

        minCostSlider.value = minValue;
        maxCostSlider.value = maxValue;
        fillSlider();
        filterTrips();
    }

    function fillSlider() {
        const minValue = minCostSlider.value;
        const maxValue = maxCostSlider.value;
        const percentage1 = (minValue / minCostSlider.max) * 100;
        const percentage2 = (maxValue / maxCostSlider.max) * 100;
        sliderTrack.style.background = `linear-gradient(to right, var(--color-lightblue2) ${percentage1}%, var(--color-lightblue) ${percentage1}%, var(--color-lightblue) ${percentage2}%, var(--color-lightblue2) ${percentage2}%)`;
    }

    function filterTrips() {
        const minValue = parseInt(minCostSlider.value);
        const maxValue = parseInt(maxCostSlider.value);

        document.querySelectorAll('.trip').forEach(trip => {
            const price = parseInt(trip.getAttribute('data-price'));
            if (price >= minValue && price <= maxValue) {
                trip.style.display = '';
            } else {
                trip.style.display = 'none';
            }
        });
    }

    minCostSlider.addEventListener('input', updateSliderValues);
    maxCostSlider.addEventListener('input', updateSliderValues);
    minCostValue.addEventListener('input', updateInputValues);
    maxCostValue.addEventListener('input', updateInputValues);

    // Initial fetch to get all trips and apply the filter immediately
    fetchTrips();
});

document.addEventListener('DOMContentLoaded', function() {
    // Привязка кнопок к функции открытия модального окна
    document.querySelectorAll('.details-button').forEach(button => {
        button.addEventListener('click', function() {
            const tripId = this.dataset.tripId;
            fetch(`/get_trip_details/${tripId}/`)
                .then(response => response.json())
                .then(data => openModalWithData(data))
                .catch(error => console.error('There was a problem with the fetch operation:', error));
        });
    });

    // Привязка кнопок добавления к функции добавления пассажира
    document.querySelectorAll('.add-button').forEach(button => {
        button.addEventListener('click', function() {
            const tripId = this.dataset.tripId;
            fetch(`/add_passenger/${tripId}/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_id: '{{ request.user.id }}' })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    location.reload();
                } else {
                    console.error(data.error);
                }
            })
            .catch(error => console.error('There was a problem with the fetch operation:', error));
        });
    });

    // Привязка кнопок удаления к функции удаления пассажира
    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', function() {
            const tripId = this.dataset.tripId;
            fetch(`/remove_passenger/${tripId}/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_id: '{{ request.user.id }}' })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    location.reload();
                } else {
                    console.error(data.error);
                }
            })
            .catch(error => console.error('There was a problem with the fetch operation:', error));
        });
    });

    function openModalWithData(tripData) {
        console.log(tripData);  // Отладочный вывод для проверки данных

        const modal = document.getElementById("customModal");
        const modalContent = modal.querySelector(".custom-modal-content");

        // Проверка существования каждого элемента перед присвоением значения
        const driverNameElement = modalContent.querySelector('.custom-driver-info h2 a');
        if (driverNameElement) {
    const currentHref = driverNameElement.getAttribute('href');
    const baseUrl = currentHref.split('?')[0]; // Отделение базового URL от параметров
    const newProfileUrl = `${baseUrl}?user_id=${tripData.driver_id}`;
    driverNameElement.setAttribute('href', newProfileUrl);
    driverNameElement.textContent = `${tripData.driver_name} ${tripData.driver_surname}`;
}
        const driverDescriptionElement = modalContent.querySelector('.custom-driver-info p');
        if (driverDescriptionElement) {
            driverDescriptionElement.textContent = tripData.driver_description;
        }

        const driverPhotoElement = modalContent.querySelector('.custom-driver-photo');
        if (driverPhotoElement) {
            driverPhotoElement.src = tripData.driver_photo_url;
        }

        const driverRatingElement = modalContent.querySelector('.custom-rating');
        if (driverRatingElement) {
            driverRatingElement.textContent = `${tripData.driver_rating} ★`;
        }

        const departureAddressElement = modalContent.querySelector('.custom-from p:nth-child(2)');
        if (departureAddressElement) {
            departureAddressElement.textContent = tripData.departure_address;
        }

        const departureDateElement = modalContent.querySelector('.custom-from p:nth-child(3)');
        if (departureDateElement) {
            departureDateElement.textContent = `${tripData.departure_date}, ${tripData.departure_time}`;
        }

        const passengersElement = modalContent.querySelector('.custom-from p:nth-child(4)');
        if (passengersElement) {
            passengersElement.textContent = `${tripData.passengers} пассажира`;
        }

        const destinationAddressElement = modalContent.querySelector('.custom-to p:nth-child(2)');
        if (destinationAddressElement) {
            destinationAddressElement.textContent = tripData.destination_address;
        }

        const arrivalDateElement = modalContent.querySelector('.custom-to p:nth-child(3)');
        if (arrivalDateElement) {
            arrivalDateElement.textContent = `${tripData.arrival_date}, ${tripData.arrival_time}`;
        }

        const priceElement = modalContent.querySelector('.custom-to p:nth-child(4)');
        if (priceElement) {
            priceElement.textContent = `${tripData.price} ₽`;
        }

        // Открытие модального окна
        modal.style.display = "flex";
        document.body.classList.add('modal-open');
    }
});
// Привязка кнопок к функции открытия модального окна
    document.querySelectorAll('.details-button').forEach(button => {
        button.addEventListener('click', function() {
            const tripId = this.dataset.tripId;
            fetch(`/get_trip_details/${tripId}/`)
                .then(response => response.json())
                .then(data => openModalWithData(data))
                .catch(error => console.error('There was a проблема with the fetch operation:', error));
        });
    });
// Получаем кнопку
var scrollToTopBtn = document.getElementById("scrollToTopBtn");

// Функция, которая показывает или скрывает кнопку в зависимости от положения прокрутки
function toggleScrollToTopButton() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scrollToTopBtn.style.display = "block";
    } else {
        scrollToTopBtn.style.display = "none";
    }
}

// Функция, которая позволяет плавно переместиться к верхней части документа
    function scrollToTop() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }

// Слушаем событие прокрутки окна
window.onscroll = function() {
  toggleScrollToTopButton();
};

// Слушаем событие клика по кнопке
scrollToTopBtn.onclick = function() {
  scrollToTop();
};