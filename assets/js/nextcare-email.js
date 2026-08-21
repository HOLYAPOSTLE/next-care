/*
 * EmailJS plumbing shared by the contact and appointment forms: credentials,
 * lazy initialisation, the submit/loading/reset lifecycle and the feedback
 * markup. Pages only describe their own fields via `params`.
 */
(function (window, document) {
    'use strict';

    var CONFIG = {
        publicKey: 'm9SgH8GWzxXurl-Ak',
        serviceId: 'service_ewcks7w',
        contactEmail: 'info@nextcaregh.com'
    };

    var initialised = false;

    function init() {
        if (!initialised && window.emailjs) {
            window.emailjs.init(CONFIG.publicKey);
            initialised = true;
        }
        return initialised;
    }

    function send(templateId, params) {
        if (!init()) {
            return Promise.reject(new Error('EmailJS is unavailable'));
        }
        return window.emailjs.send(CONFIG.serviceId, templateId, params);
    }

    function alertMarkup(variant, icon, body) {
        return '<div class="alert alert-' + variant + ' alert-dismissible fade show" role="alert">' +
            '<i class="fas fa-' + icon + ' me-2"></i>' + body +
            '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
            '</div>';
    }

    /*
     * options:
     *   formId, templateId, responseId   – element ids and the EmailJS template
     *   params(form)                     – template parameters for this form
     *   messages                         – { sending, success, error } (html)
     *   button                           – { id, textId, spinnerId, sendingText, defaultText }
     *   alerts                           – false to render plain text instead of bootstrap alerts
     */
    function handleForm(options) {
        var form = document.getElementById(options.formId);
        if (!form) {
            return;
        }

        var response = document.getElementById(options.responseId);
        var button = options.button || {};
        var submitBtn = button.id ? document.getElementById(button.id) : null;
        var btnText = button.textId ? document.getElementById(button.textId) : null;
        var btnSpinner = button.spinnerId ? document.getElementById(button.spinnerId) : null;
        var messages = options.messages || {};
        var useAlerts = options.alerts !== false;

        function setPending(pending) {
            if (btnText) {
                btnText.textContent = pending ? (button.sendingText || 'Sending...') : (button.defaultText || 'Send');
            }
            if (btnSpinner) {
                btnSpinner.classList.toggle('d-none', !pending);
            }
            if (submitBtn) {
                submitBtn.disabled = pending;
            }
        }

        function render(state, html) {
            if (!response) {
                return;
            }
            if (useAlerts) {
                response.className = '';
                response.innerHTML = state === 'pending' ? html
                    : alertMarkup(state === 'success' ? 'success' : 'danger',
                        state === 'success' ? 'check-circle' : 'exclamation-circle', html);
            } else {
                response.className = state === 'pending' ? '' : state;
                response.innerHTML = html;
            }
        }

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            render('pending', messages.sending || '');
            setPending(true);

            send(options.templateId, options.params(form))
                .then(function () {
                    render('success', messages.success || 'Message sent successfully!');
                    form.reset();
                }, function (error) {
                    console.error('EmailJS Error:', error);
                    render('error', messages.error || 'Failed to send. Please try again.');
                })
                .then(function () {
                    setPending(false);
                });
        });
    }

    window.NextCare = window.NextCare || {};
    window.NextCare.email = {
        config: CONFIG,
        init: init,
        send: send,
        alertMarkup: alertMarkup,
        handleForm: handleForm
    };
})(window, document);
