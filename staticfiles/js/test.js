document.addEventListener('DOMContentLoaded', function() {
    // Находим кнопку для открытия модального окна
    var openModalBtns = document.querySelectorAll('.openModalBtn');

    // Находим само модальное окно
    var modal = document.getElementById('customModal');

    // Находим элемент для закрытия модального окна
    var closeModalBtn = modal.querySelector('.custom-close-btn');

    // Для каждой кнопки добавляем обработчик события клика
    openModalBtns.forEach(function(btn) {
        btn.addEventListener('click', function(event) {
            event.preventDefault(); // Предотвращаем действие по умолчанию (переход по ссылке)

            // Получаем данные из атрибутов data
            var tripId = btn.getAttribute('data-trip-id');
            var userTrip = btn.getAttribute('data-user-trip');

            // TODO: Здесь можно выполнить AJAX запрос для загрузки данных поездки на основе tripId и userTrip

            // Открываем модальное окно
            modal.style.display = 'block';
        });
    });

    // Добавляем обработчик события для закрытия модального окна при клике на кнопку закрытия
    closeModalBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Закрытие модального окна при клике вне его области
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});