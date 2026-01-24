document.addEventListener("DOMContentLoaded", function() {

    document.addEventListener('click', function(e) {

        // Check if submit button (.t-submit) was clicked
        var btn = e.target.closest('.t-submit');

        if (btn) {
            // Find the parent form
            var form = btn.closest('form');

            // Check if this is OUR form (has hidden field is_bonus_form)
            if (form && form.querySelector('input[name="is_bonus_form"]')) {

                // STOP TILDA SUBMISSION
                e.preventDefault();
                e.stopPropagation();

                // Save original button text
                if (!btn.getAttribute('data-original-text')) {
                    btn.setAttribute('data-original-text', btn.innerHTML);
                }

                // Find phone input
                var phoneInput = form.querySelector('input[name="phone"]');
                var cleanPhone = phoneInput ? phoneInput.value.replace(/[^\d]/g, '') : '';

                // Formatting
                if (cleanPhone.length === 10) cleanPhone = '+7' + cleanPhone;
                else if (cleanPhone.length === 11 && cleanPhone.startsWith('8')) cleanPhone = '+7' + cleanPhone.substring(1);
                else if (cleanPhone.length === 11 && cleanPhone.startsWith('7')) cleanPhone = '+' + cleanPhone;

                // Validation
                if (cleanPhone.length < 11) {
                    alert('Please enter a valid number');
                    return;
                }

                // Show loading state
                btn.innerHTML = 'Loading...';
                btn.style.opacity = '0.7';

                // Clear previous response
                var oldRes = form.querySelector('.bonus-popup-result');
                if (oldRes) oldRes.remove();

                // N8N REQUEST
                fetch('https://n8n.your-domain.com/webhook/check-balance', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({phone: cleanPhone})
                })
                .then(function(res) { return res.json(); })
                .then(function(data) {

                    // Restore button state
                    btn.innerHTML = btn.getAttribute('data-original-text');
                    btn.style.opacity = '1';

                    var bonuses = parseInt(data.balance || 0);

                    // Render response UI
                    var resultBox = document.createElement('div');
                    resultBox.className = 'bonus-popup-result';
                    resultBox.style.cssText = 'margin-top: 20px; text-align: center; font-size: 18px; font-family: Gotham, sans-serif; font-weight: bold; line-height: 1.4;';

                    if (bonuses > 0) {
                        resultBox.innerHTML =
                            '<div style="text-align: center; font-family: Gotham, Arial, sans-serif;">' +
                                // Single line: Text + Value
                                '<div style="font-size: 18px; margin-bottom: 8px;">' +
                                    '<span style="color: #000;">Your Balance: </span>' +
                                    '<span style="color: #008000; font-weight: bold;">' + bonuses + ' ₽ </span>' +
                                '</div>' +
                                '<div style="font-size: 13px; color: #777; font-weight: normal;">You can use points on the website or in our coffee shops</div>' +
                            '</div>';
                    } else {
                        resultBox.innerHTML =
                            '<div style="text-align: center; font-family: Gotham, Arial, sans-serif;">' +
                                '<div style="color: #333; font-size: 16px; font-weight: bold; margin-bottom: 5px;">No points available yet</div>' +
                                '<div style="font-size: 13px; color: #777;">Make new orders to earn cashback!</div>' +
                            '</div>';
                    }

                    // Insert response below the button
                    var btnWrapper = form.querySelector('.t-form__submit');
                    if (btnWrapper) btnWrapper.appendChild(resultBox);
                    else form.appendChild(resultBox);
                })
                .catch(function(err) {
                    console.error(err);
                    btn.innerHTML = btn.getAttribute('data-original-text');
                    btn.style.opacity = '1';
                    alert('Connection error. Please try again later.');
                });
            }
        }
    }, true);
});
