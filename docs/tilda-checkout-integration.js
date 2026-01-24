document.addEventListener("DOMContentLoaded", function() {

    let currentBonus = 0;

    setInterval(function() {

        // Find phone input field
        const phoneInput = document.querySelector('.t706 input[type="tel"]') || document.querySelector('input[name="phone"]');

        if (!phoneInput || document.getElementById('my-bonus-wrapper')) return;

        // --- UI CONSTRUCTION ---
        const wrapper = document.createElement('div');
        wrapper.id = 'my-bonus-wrapper';
        wrapper.style.marginTop = '15px';

        const btn = document.createElement('div');
        btn.innerHTML = 'Check Points';
        btn.style.cssText = 'background: #000; color: #fff; padding: 16px; text-align: center; border-radius: 15px; font-weight: 600; font-size: 14px; cursor: pointer; user-select: none; font-family: Gotham, sans-serif;';

        const resultText = document.createElement('div');
        resultText.style.cssText = 'margin-top: 10px; text-align: center; font-size: 14px; font-weight: bold; color: #333; min-height: 10px; font-family: Gotham, sans-serif;';

        const checkboxContainer = document.createElement('label');
        checkboxContainer.style.cssText = 'display: none; align-items: center; justify-content: center; margin-top: 10px; cursor: pointer; font-family: Gotham, sans-serif;';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.style.cssText = 'width: 18px; height: 18px; margin-right: 8px;';

        const checkboxLabel = document.createElement('span');
        checkboxLabel.style.cssText = 'font-size: 14px; font-family: Gotham, sans-serif;';

        checkboxContainer.appendChild(checkbox);
        checkboxContainer.appendChild(checkboxLabel);
        wrapper.appendChild(btn);
        wrapper.appendChild(resultText);
        wrapper.appendChild(checkboxContainer);

        const inputGroup = phoneInput.closest('.t-input-block') || phoneInput.parentNode;
        inputGroup.parentNode.insertBefore(wrapper, inputGroup.nextSibling);

        // --- BUTTON LOGIC ---
        btn.onclick = function() {
            updateTotalPrice(0);
            checkbox.checked = false;
            checkboxContainer.style.display = 'none';
            updateHiddenField(false);

            let cleanPhone = phoneInput.value.replace(/[^\d]/g, '');

            if (cleanPhone.length === 10) cleanPhone = '+7' + cleanPhone;
            else if (cleanPhone.length === 11 && cleanPhone.startsWith('8')) cleanPhone = '+7' + cleanPhone.substring(1);
            else if (cleanPhone.length === 11 && cleanPhone.startsWith('7')) cleanPhone = '+' + cleanPhone;

            if (cleanPhone.length < 11) {
                resultText.innerHTML = '<span style="color:red">Enter full phone number</span>';
                return;
            }

            btn.innerHTML = 'Loading...';
            resultText.innerHTML = '';

            fetch('https://n8n.your-domain.com/webhook/check-balance', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({phone: cleanPhone})
            })
            .then(res => res.json())
            .then(data => {
                btn.innerHTML = 'Check Points';
                const bal = parseInt(data.balance || 0);

                if (bal > 0) {
                    currentBonus = bal;
                    resultText.innerHTML = 'Balance: <span style="color:green">' + bal + ' ₽ </span>';
                    checkboxLabel.innerText = 'Redeem ' + bal + ' Points';
                    checkboxContainer.style.display = 'flex';
                } else {
                    resultText.innerHTML = 'No points available';
                }
            })
            .catch(err => {
                btn.innerHTML = 'Check Points';
                resultText.innerHTML = 'Connection error';
            });
        };

        // --- CHECKBOX LOGIC ---
        checkbox.onchange = function() {
            updateHiddenField(this.checked);
            if (this.checked) {
                updateTotalPrice(currentBonus);
            } else {
                updateTotalPrice(0);
            }
        };

    }, 1000);

    function updateHiddenField(isChecked) {
        const hiddenInput = document.querySelector('input[name="spend_bonus"]');
        if (hiddenInput) {
            hiddenInput.value = isChecked ? 'yes' : '';
        }
    }

    // --- PRICE UPDATE FUNCTION (WITH CURRENCY) ---
    function updateTotalPrice(discount) {
        const priceElement = document.querySelector('.t706__cartwin-totalamount');
        if (!priceElement) return;

        let originalPrice = parseFloat(priceElement.getAttribute('data-original'));

        if (!originalPrice) {
            let rawText = priceElement.innerText.replace(/[^\d]/g, '');
            originalPrice = parseFloat(rawText);
            if (originalPrice > 0) {
                priceElement.setAttribute('data-original', originalPrice);
            }
        }

        if (!originalPrice) return;

        let realDiscount = discount;
        if (discount > originalPrice) {
            realDiscount = originalPrice;
        }

        let newTotal = originalPrice - realDiscount;

        priceElement.innerText = newTotal.toLocaleString('ru-RU') + ' ₽ ';

        // Green success label below
        const parent = priceElement.parentNode;
        let bonusTag = parent.querySelector('.bonus-tag-info');

        if (realDiscount > 0) {
            if (!bonusTag) {
                bonusTag = document.createElement('div');
                bonusTag.className = 'bonus-tag-info';
                bonusTag.style.cssText = 'color: #22c35e; font-size: 14px; font-weight: 600; margin-top: 2px; text-align: right; width: 100%;';
                parent.appendChild(bonusTag);
            }
            bonusTag.innerText = 'Discount: -' + realDiscount + ' ₽ ';
        } else {
            if (bonusTag) bonusTag.remove();
        }
    }

});
