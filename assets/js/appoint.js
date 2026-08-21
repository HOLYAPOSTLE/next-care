/* Doctors listing page: speciality filter and the booking modal. */
(function (window, document) {
    'use strict';

    document.querySelectorAll('.filter-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.filter-btn').forEach(function (b) {
                b.classList.remove('active');
            });
            this.classList.add('active');

            var filter = this.getAttribute('data-filter');
            var visibleCount = 0;

            document.querySelectorAll('.doctor-item').forEach(function (item) {
                var visible = filter === 'all' || item.getAttribute('data-category') === filter;
                item.style.display = visible ? 'block' : 'none';
                if (visible) {
                    visibleCount++;
                }
            });

            document.getElementById('noResults').classList.toggle('d-none', visibleCount > 0);
        });
    });

    window.openBookingModal = function (doctorName, specialty) {
        document.getElementById('doctorName').value = doctorName;
        document.getElementById('doctorSpecialty').value = specialty;
        document.getElementById('bookingModalLabel').textContent = 'Book Appointment';
        document.getElementById('selectedDoctorInfo').textContent = 'with ' + doctorName + ' - ' + specialty;

        new bootstrap.Modal(document.getElementById('bookingModal')).show();
    };

    document.getElementById('bookingForm').addEventListener('submit', function (e) {
        e.preventDefault();

        new bootstrap.Toast(document.getElementById('successToast')).show();
        bootstrap.Modal.getInstance(document.getElementById('bookingModal')).hide();
        this.reset();

        setTimeout(function () {
            this.submit();
        }.bind(this), 1500);
    });
})(window, document);
