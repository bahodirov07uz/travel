document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('publish-button').addEventListener('click', function() {
        window.location.href = '{% url "main:add_trip" %}';
    });

    document.getElementById('find-button').addEventListener('click', function() {
        window.location.href = '{% url "main:catalog" %}';
    });
});

// кнопка навбара
document.querySelector('.navbar-toggle').addEventListener('click', function() {
    document.querySelector('.header-buttons').classList.toggle('active');
});

// свгшка
window.addEventListener('resize', function() {
    const largeSVG = document.querySelector('.svg-large');
    const smallSVG = document.querySelector('.svg-small');

    if (window.innerWidth <= 420) {
        largeSVG.style.display = 'none';
        smallSVG.style.display = 'block';
    } else {
        largeSVG.style.display = 'block';
        smallSVG.style.display = 'none';
    }
});

// Инициализация при загрузке страницы
window.dispatchEvent(new Event('resize'));

// Автозаполнение городов
document.addEventListener('DOMContentLoaded', function () {
    const departureInput = document.getElementById('departure');
    const arrivalInput = document.getElementById('arrival');

    function setupAutocomplete(input, dataListId) {
        input.addEventListener('input', function () {
            const value = this.value;
            const dataList = document.getElementById(dataListId);
            dataList.innerHTML = '';

            console.log(`Input value: ${value}`);  // Отладочное сообщение

            if (value) {
                const url = `/city_suggestions?q=${encodeURIComponent(value)}`;
                console.log(`Fetching URL: ${url}`);  // Новое отладочное сообщение

                fetch(url)
                    .then(response => {
                        if (response.ok) {
                            return response.json();
                        } else {
                            console.error(`Error: ${response.status} ${response.statusText}`);
                            throw new Error(`Network response was not ok: ${response.statusText}`);
                        }
                    })
                    .then(cities => {
                        console.log(cities);  // Отладочное сообщение
                        cities.forEach(city => {
                            const option = document.createElement('option');
                            option.value = city.name;
                            dataList.appendChild(option);
                        });
                    })
                    .catch(error => {
                        console.error('There was a problem with the fetch operation:', error);
                    });
            }
        });
    }

    setupAutocomplete(departureInput, 'departure-list');
    setupAutocomplete(arrivalInput, 'arrival-list');
});


// FAQ
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            faqItems.forEach(i => {
                if (i !== item) {
                    i.classList.remove('open');
                    i.querySelector('.faq-answer').style.maxHeight = 0;
                    i.querySelector('.faq-icon').textContent = '+';
                }
            });

            item.classList.toggle('open');
            const icon = question.querySelector('.faq-icon');
            icon.textContent = item.classList.contains('open') ? '-' : '+';

            if (item.classList.contains('open')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = 0;
            }
        });
    });
});