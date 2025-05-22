document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('deleteModal');
    const closeBtn = document.querySelector('.close');
    const cancelBtn = document.querySelector('.modal-button-cancel');
    const confirmBtn = document.getElementById('confirmDelete');
    let deleteType = '';
    let tripId = '';

    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', function() {
            tripId = this.getAttribute('data-trip-id');
            deleteType = this.getAttribute('data-delete-type');
            modal.style.display = 'block';
        });
    });

    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    cancelBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    confirmBtn.addEventListener('click', function() {
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        const url = deleteType === 'trip' ? `/delete_trip/${tripId}/` : `/leave_trip/${tripId}/`;
        fetch(url, {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrfToken,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                window.location.reload();
            } else {
                alert('Произошла ошибка при удалении поездки.');
            }
        })
        .catch(error => {
            alert('Произошла ошибка при удалении поездки.');
        });
    });

    document.getElementById('passwordForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(this);

        fetch(this.action, {
            method: 'POST',
            headers: {
                'X-CSRFToken': formData.get('csrfmiddlewaretoken')
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                closePasswordModal();
                alert('Пароль успешно изменен');
            } else {
                if (data.errors) {
                    const errors = JSON.parse(data.errors);
                    for (const [field, messages] of Object.entries(errors)) {
                        alert(`${field}: ${messages.map(message => message.message).join(', ')}`);
                    }
                } else {
                    alert('Ошибка при смене пароля');
                }
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
        });
    });

    window.openPasswordModal = function() {
        document.getElementById('passwordModal').style.display = 'block';
    }

    window.closePasswordModal = function() {
        document.getElementById('passwordModal').style.display = 'none';
    }

    document.querySelector('.navbar-toggle').addEventListener('click', function() {
        document.querySelector('.header-buttons').classList.toggle('active');
    });

    function updateSVGDisplay() {
        const largeSVG = document.querySelector('.svg-large');
        const smallSVG = document.querySelector('.svg-small');

        if (window.innerWidth <= 420) {
            largeSVG.style.display = 'none';
            smallSVG.style.display = 'block';
        } else {
            largeSVG.style.display = 'block';
            smallSVG.style.display = 'none';
        }
    }

    window.addEventListener('resize', updateSVGDisplay);
    window.dispatchEvent(new Event('resize'));

    document.querySelectorAll('.add-button').forEach(function(button) {
        button.addEventListener('click', function() {
            const tripId = this.dataset.tripId;
            console.log(`Добавление пассажира в поездку с ID: ${tripId}`);
            fetch(`/add_passenger/${tripId}/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': '{{ csrf_token }}',
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
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
        });
    });

    document.querySelectorAll('.notification-action').forEach(function(button) {
        button.addEventListener('click', function() {
            const notificationId = this.dataset.notificationId;
            const action = this.dataset.action;
            console.log(`Обработка действия ${action} для уведомления с ID: ${notificationId}`);
            fetch(`/handle_passenger_request/${notificationId}/${action}/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': '{{ csrf_token }}',
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
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
        });
    });

    const avatarIcon = document.getElementById('avatar-icon');
    const avatarInput = document.getElementById('avatar-input');
    const avatarImage = document.getElementById('avatar-image');
    const saveButton = document.querySelector('.profile-save');

    avatarIcon.addEventListener('click', function() {
        avatarInput.click();
    });

    avatarInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                avatarImage.src = e.target.result;
                avatarIcon.innerHTML = '';
                avatarIcon.appendChild(avatarImage);
                saveButton.classList.add('needs-save');
            }
            reader.readAsDataURL(file);
        }
    });

    window.editField = function(field) {
        const displayElement = document.getElementById(field + '_display');
        const inputElement = document.getElementById(field + '_input');

        if (inputElement.style.display === 'none') {
            inputElement.style.display = 'block';
            displayElement.style.display = 'none';
        } else {
            inputElement.style.display = 'none';
            displayElement.style.display = 'block';
        }
    }

let currentTripId = null; // Добавляем глобальную переменную для текущего tripId

document.querySelectorAll('.openModalBtn').forEach(function(button) {
    button.addEventListener('click', function() {
        const tripId = this.dataset.tripId;
        const userTrip = this.dataset.userTrip === 'True';

        if (!tripId) {
            console.error('tripId is undefined');
            return;
        }

        currentTripId = tripId; // Устанавливаем текущий tripId

        fetch(`/get_trip_details_profile/${tripId}/`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                const fromAddressElem = document.getElementById('trip-from-address');
                const toAddressElem = document.getElementById('trip-to-address');
                const seatsElem = document.getElementById('trip-seats');
                const priceElem = document.getElementById('trip-price');
                const departureDateElem = document.getElementById('trip-departure-date');
                const arrivalDateElem = document.getElementById('trip-arrival-date');
                const driverInfoElem = document.getElementById('driver-info');
                const priceSectionElem = document.getElementById('trip-price-section');
                const passengersInfoElem = document.getElementById('passengers-info');
                const tripActionsElem = document.getElementById('trip-actions');
                const startTripBtn = document.getElementById('start-trip-btn');
                const endTripBtn = document.getElementById('end-trip-btn');
                const passengersListElem = document.getElementById('passengers-list');

                if (fromAddressElem) fromAddressElem.textContent = data.departure_address || '';
                if (toAddressElem) toAddressElem.textContent = data.destination_address || '';
                if (seatsElem) seatsElem.textContent = `${data.seats_taken || 0}/${data.total_seats || 0}`;
                if (priceElem) priceElem.textContent = (data.price || 0) + " р";

                if (departureDateElem) {
                    departureDateElem.textContent = `${data.departure_date || ''} ${data.departure_time || ''}`;
                }
                if (arrivalDateElem) {
                    arrivalDateElem.textContent = `${data.arrival_date || ''} ${data.arrival_time || ''}`;
                }

                if (userTrip) {
                    if (driverInfoElem) driverInfoElem.style.display = 'none';
                    if (priceSectionElem) priceSectionElem.style.display = 'none';

                    if (passengersInfoElem) passengersInfoElem.style.display = 'block';
                    if (tripActionsElem) tripActionsElem.style.display = 'block';
                    if (startTripBtn) startTripBtn.style.display = data.status === 'planned' ? 'block' : 'none';
                    if (endTripBtn) endTripBtn.style.display = data.status === 'in_progress' ? 'block' : 'none';

                    if (passengersListElem) {
                        passengersListElem.innerHTML = ''; // Clear the list before adding passengers
                        if (Array.isArray(data.passengers)) {
                            data.passengers.forEach((passenger, index) => {
                                const listItem = document.createElement('li');
                                listItem.textContent = passenger.name;

                                const removeButton = document.createElement('button');
                                removeButton.textContent = 'Удалить';
                                removeButton.classList.add('remove-passenger-btn');
                                removeButton.dataset.passengerId = passenger.id;

                                removeButton.addEventListener('click', function() {
                                    removePassenger(tripId, passenger.id, index);
                                });

                                listItem.appendChild(removeButton);
                                passengersListElem.appendChild(listItem);
                            });
                        }
                    }
                } else {
                    if (driverInfoElem) driverInfoElem.style.display = 'block';
                    if (priceSectionElem) priceSectionElem.style.display = 'block';
                    if (passengersInfoElem) passengersInfoElem.style.display = 'none';
                    if (tripActionsElem) tripActionsElem.style.display = 'none';

                    if (data.driver_photo) {
                        const driverPhotoElem = document.getElementById('driver-photo');
                        if (driverPhotoElem) driverPhotoElem.src = data.driver_photo;
                    }
                    const driverNameElem = document.getElementById('driver-name');
                    const driverProfileLinkElem = document.getElementById('driver-profile-link');

                    if (driverNameElem) {
                        driverNameElem.textContent = `${data.driver_name || ''} ${data.driver_surname || ''}`;
                    }
                    if (driverProfileLinkElem) {
                        driverProfileLinkElem.href = `/profile_user/?user_id=${data.driver_id}`;
                    }

                    const driverDescElem = document.getElementById('driver-description');
                    if (driverDescElem) driverDescElem.textContent = data.driver_description || '';

                    const driverRatingElem = document.getElementById('driver-rating');
                    if (driverRatingElem) {
                        driverRatingElem.textContent = data.driver_rating !== undefined ? data.driver_rating + "★" : "No rating";
                    }
                }

                const customModalElem = document.getElementById('customModal');
                if (customModalElem) customModalElem.style.display = 'block';
                document.body.classList.add('modal-open');
            })
            .catch(error => console.error('Error fetching trip details:', error));
    });
});

const customCloseBtn = document.querySelector('.custom-close-btn');
if (customCloseBtn) {
    customCloseBtn.addEventListener('click', function() {
        const customModalElem = document.getElementById('customModal');
        if (customModalElem) customModalElem.style.display = 'none';
        document.body.classList.remove('modal-open');
        currentTripId = null; // Сбрасываем текущий tripId
    });


const startTripBtn = document.getElementById('start-trip-btn');
if (startTripBtn) {
    startTripBtn.addEventListener('click', function() {
        if (!currentTripId) {
            console.error('No tripId available');
            return;
        }

        fetch(`/start_trip/${currentTripId}/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Поездка началась');
                startTripBtn.style.display = 'none';
                endTripBtn.style.display = 'block';

                const tripStatusElem = document.querySelector(`.trip-status[data-trip-id="${currentTripId}"]`);
                if (tripStatusElem) {
                    tripStatusElem.textContent = 'in_progress';
                }
            } else {
                alert(data.message || 'Ошибка при начале поездки');
            }
        })
        .catch(error => console.error('Error starting trip:', error));
    });
}

const endTripBtn = document.getElementById('end-trip-btn');
if (endTripBtn) {
    endTripBtn.addEventListener('click', function() {
        if (!currentTripId) {
            console.error('No tripId available');
            return;
        }

        fetch(`/end_trip/${currentTripId}/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Поездка завершена');
                const customModalElem = document.getElementById('customModal');
                if (customModalElem) customModalElem.style.display = 'none';
                document.body.classList.remove('modal-open');
                window.location.reload();
            } else {
                alert(data.message || 'Ошибка при завершении поездки');
            }
        })
        .catch(error => console.error('Error ending trip:', error));
    });
}

function removePassenger(tripId, passengerId, index) {
    console.log('Trip ID:', tripId);
    console.log('Passenger ID:', passengerId);

    if (!tripId || !passengerId) {
        console.error('Trip ID or Passenger ID is missing');
        return;
    }

    fetch(`/remove_passenger/${tripId}/${passengerId}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Пассажир удален');
            const passengersListElem = document.getElementById('passengers-list');
            if (passengersListElem) {
                const listItems = passengersListElem.getElementsByTagName('li');
                if (listItems[index]) {
                    passengersListElem.removeChild(listItems[index]);
                }
            }
        } else {
            alert(data.message || 'Ошибка при удалении пассажира');
        }
    })
    .catch(error => console.error('Error removing passenger:', error));
}
}
})