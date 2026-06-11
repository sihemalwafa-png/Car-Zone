function updateFavoritesCounter() {

    const favLink = document.querySelector('.nav ul li a[href="#Favorites"]');
    if (!favLink) return;

    const favCount = document.querySelectorAll('#Favorites .car-card').length;
    
    let counterSpan = favLink.querySelector('.fav-badge');
    if (!counterSpan) {
        counterSpan = document.createElement('span');
        counterSpan.className = 'fav-badge';
        counterSpan.style.cssText = `
            background-color: red;
            color: white;
            border-radius: 50%;
            padding: 2px 7px;
            font-size: 11px;
            margin-right: 5px;
            font-weight: bold;
            display: inline-block;
        `;
        favLink.appendChild(counterSpan);
    }

    if (favCount > 0) {
        counterSpan.innerText = favCount;
        counterSpan.style.display = 'inline-block';
    } else {
        counterSpan.style.display = 'none';
    }
}


const themeToggleBtn = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    if (themeIcon) themeIcon.src = 'sun.png';
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            if (themeIcon) themeIcon.src = 'sun.png';
            localStorage.setItem('theme', 'dark');
        } else {
            if (themeIcon) themeIcon.src = 'moon.png';
            localStorage.setItem('theme', 'light');
        }
    });
}

const favoritesContainer = document.querySelector('.favorites-container');

function showToast(message) {
    const oldToast = document.querySelector('.fav-toast');
    if (oldToast) oldToast.remove();

    const toast = document.createElement('div');
    toast.className = 'fav-toast';
    toast.innerHTML = `🌟 <span>${message}</span>`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.4s ease';
        setTimeout(() => { toast.remove(); }, 400);
    }, 3000);
}

document.addEventListener('click', (event) => {
    const heartBtn = event.target.closest('.heart-btn') || event.target.closest('.heart');
    if (!heartBtn) return;

    event.preventDefault();
    const heartImg = heartBtn.querySelector('img');
    const carCard = heartBtn.closest('.car-card');
    if (!carCard || !heartImg) return;

    const carName = carCard.querySelector('.car-name').textContent;
    const isInFavoritesSection = heartBtn.closest('#Favorites');

    if (isInFavoritesSection) {
        carCard.remove();
        showToast(`تمت إزالة ${carName} من المفضلة`);
        
        const allCards = document.querySelectorAll(`#Home .car-card, #Cars .car-card`);
        allCards.forEach(card => {
            if (card.querySelector('.car-name').textContent === carName) {
                const originalHeartImg = card.querySelector('.heart-btn img') || card.querySelector('.heart img');
                if (originalHeartImg) originalHeartImg.classList.remove('red-heart');
            }
        });
    } else {
        if (heartImg.classList.contains('red-heart')) {
            heartImg.classList.remove('red-heart');
            showToast(`تمت إزالة ${carName} من المفضلة`);
            
            if (favoritesContainer) {
                const favCards = favoritesContainer.querySelectorAll('.car-card');
                favCards.forEach(favCard => {
                    if (favCard.querySelector('.car-name').textContent === carName) favCard.remove();
                });
            }
        } else {
            heartImg.classList.add('red-heart');
            showToast(`تمت إضافة ${carName} إلى المفضلة بنجاح`);
            
            if (favoritesContainer) {
                const clonedCard = carCard.cloneNode(true);
                const clonedHeartImg = clonedCard.querySelector('.heart-btn img') || clonedCard.querySelector('.heart img');
                if (clonedHeartImg) clonedHeartImg.classList.add('red-heart');
                favoritesContainer.appendChild(clonedCard);
            }
        }
    }
    updateFavoritesCounter();
});


const searchBtn = document.querySelector('.search-submit-btn');
if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      
        const searchInput = document.querySelector('.input-group input[type="text"]').value.toLowerCase().trim();
    
        const carCards = document.querySelectorAll('#Cars .car-card, #Home .car-card');
        
        let foundCount = 0;

        carCards.forEach(card => {
            const carName = card.querySelector('.car-name').textContent.toLowerCase();
            
            if (carName.includes(searchInput)) {
                card.style.display = 'flex'; 
                foundCount++;
            } else {
                card.style.display = 'none'; 
            }
        });

        showToast(`تم العثور على ${foundCount} من السيارات المطابقة`);
    });
}


const sortSelect = document.querySelector('.sort select');
if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
        const sortBy = e.target.value; 
        const grid = document.querySelector('.cars-grad') || document.querySelector('.cars-grid');
        if (!grid) return;

        const cardsArray = Array.from(grid.querySelectorAll('.car-card'));

        cardsArray.sort((a, b) => {

            const priceA = parseFloat(a.querySelector('.car-price').textContent.replace(/[^0-9.-]+/g, ""));
            const priceB = parseFloat(b.querySelector('.car-price').textContent.replace(/[^0-9.-]+/g, ""));

            const yearA = parseInt(a.querySelector('.car-year').textContent);
            const yearB = parseInt(b.querySelector('.car-year').textContent);

            if (sortBy === 'الأرخص') return priceA - priceB;
            if (sortBy === 'الأغلى') return priceB - priceA;
            if (sortBy === 'الأحدث') return yearB - yearA;
            if (sortBy === 'الأقدم') return yearA - yearB;
            return 0;
        });

        grid.innerHTML = '';
        cardsArray.forEach(card => grid.appendChild(card));
        showToast(`تم الترتيب حسب: ${sortBy}`);
    });
}

document.addEventListener('DOMContentLoaded', updateFavoritesCounter);

// ==========================================================================
// 6. برمجة التحقق من صحة مدخلات الاستمارة (Form Validation)
// ==========================================================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault(); // منع إرسال وتحديث الصفحة فوراً لكي نفحص البيانات أولاً

        // جلب الحقول
        const name = document.getElementById('userName');
        const email = document.getElementById('userEmail');
        const phone = document.getElementById('userPhone');
        const message = document.getElementById('userMessage');

        let isValid = true;

        // دالة مساعدة لإظهار الخطأ
        function inputFieldError(inputElement, errorMessage) {
            const errorSpan = inputElement.nextElementSibling;
            inputElement.classList.add('input-error');
            errorSpan.innerText = errorMessage;
            errorSpan.style.display = 'block';
            isValid = false;
        }

        // دالة مساعدة لتنظيف الأخطاء السابقة
        function clearFieldError(inputElement) {
            const errorSpan = inputElement.nextElementSibling;
            inputElement.classList.remove('input-error');
            errorSpan.style.display = 'none';
        }

        // 1. تنظيف كل الأخطاء السابقة قبل الفحص الجديد
        clearFieldError(name);
        clearFieldError(email);
        clearFieldError(phone);
        clearFieldError(message);

        // 2. الفحص: التحقق من حقل الاسم
        if (name.value.trim() === '') {
            inputFieldError(name, 'يرجى كتابة الاسم الكامل من فضلك');
        }

        // 3. الفحص: التحقق من البريد الإلكتروني وصيغته
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.value.trim() === '') {
            inputFieldError(email, 'البريد الإلكتروني مطلوب');
        } else if (!emailPattern.test(email.value.trim())) {
            inputFieldError(email, 'صيغة البريد الإلكتروني غير صحيحة');
        }

        // 4. الفحص: التحقق من رقم الهاتف (أن يكون أرقاماً فقط ولا يقل عن 9 أرقام)
        if (phone.value.trim() === '') {
            inputFieldError(phone, 'رقم الهاتف مطلوب');
        } else if (isNaN(phone.value.trim()) || phone.value.trim().length < 9) {
            inputFieldError(phone, 'يرجى كتابة رقم هاتف صحيح (9 أرقام على الأقل)');
        }

        // 5. الفحص: التحقق من نص الرسالة
        if (message.value.trim() === '') {
            inputFieldError(message, 'لا يمكنك إرسال رسالة فارغة');
        }

        // النتيجة النهائية: إذا كانت كل الحقول سليمة وصحيحة
        if (isValid) {
            showToast('🚀 تم إرسال رسالتك بنجاح! شكراً لتواصلك معنا');
            contactForm.reset(); // تفريغ الخانات بعد الإرسال الناجح
        }
    });
}
