document.addEventListener("DOMContentLoaded", function () {
    // Icon class mapping
    const iconMap = {
        home: "fas fa-home",
        tsdp: "fas fa-star",
        registration: "fas fa-user-edit",
        accommodation: "fas fa-bed",
        food: "fas fa-utensils",
        events: "fas fa-calendar-alt",
        contact: "fas fa-envelope"
    };

    
    // Initialize all icons as empty
    let homeIcon = "", tsdpIcon = "", registrationIcon = "", accommodationIcon = "", foodIcon = "", eventsIcon = "", contactIcon = "";

    // Get the id of the element with class "top"
    const hash = window.location.hash.replace('#', '').toLowerCase(); // e.g., "accommodation"
    if (hash && iconMap[hash]) {
        const iconHTML = `<i class="${iconMap[hash]} mr-2"></i>`;
        switch (hash) {
            case "home": homeIcon = iconHTML; break;
            case "tsdp": tsdpIcon = iconHTML; break;
            case "registration": registrationIcon = iconHTML; break;
            case "accommodation": accommodationIcon = iconHTML; break;
            case "food": foodIcon = iconHTML; break;
            case "events": eventsIcon = iconHTML; break;
            case "contact": contactIcon = iconHTML; break;
        }
    }
 
    // Build nav HTML with icons prepended
    const navHTML = `
        <nav class="fixed w-full  bg-black  text-2xl" id="tm-nav">
            <div class="tm-container mx-auto px-2 md:py-6 text-right">
                <button class="md:hidden py-2 px-2" id="menu-toggle">
                    <i class="fas fa-2x fa-bars tm-text-gold"></i>
                </button>
                <ul class="mb-3 md:mb-0 text-2xl font-normal flex justify-end flex-col md:flex-row">
                    <li class="inline-block mb-4 mx-4"><a class="tm-text-gold py-1 md:py-3 px-4" href="index.html#home">${homeIcon}Home</a></li>
                    <li class="inline-block mb-4 mx-4"><a class="tm-text-gold py-1 md:py-3 px-4" href="tsdp.html#tsdp">${tsdpIcon}TSDP</a></li>
                    <li class="inline-block mb-4 mx-4"><a class="tm-text-gold py-1 md:py-3 px-4" href="registration.html#registration">${registrationIcon}Registration</a></li>
                    <li class="inline-block mb-4 mx-4"><a class="tm-text-gold py-1 md:py-3 px-4" href="tsdp-accommodation.html#accommodation">${accommodationIcon}Accommodation</a></li>
                  
                    <li class="inline-block mb-4 mx-4"><a class="tm-text-gold py-1 md:py-3 px-4" href="tsdp-events.html#events">${eventsIcon}Events</a></li>
                    <li class="inline-block mb-4 mx-4"><a class="tm-text-gold py-1 md:py-3 px-4" href="tsdp.html#committee">${contactIcon}Committee</a></li>
                </ul>
            </div>
        </nav>`;
//<li class="inline-block mb-4 mx-4"><a class="tm-text-gold py-1 md:py-3 px-4" href="tsdp-food.html#food">${foodIcon}Food</a></li>
    const parallaxWindow = document.querySelector(".top");
    if (parallaxWindow) {
        parallaxWindow.insertAdjacentHTML("afterbegin", navHTML);
    }

    setTimeout(() => {
        initMenuLogic();
    }, 1000);
});


function checkAndShowHideMenu() {
    if (window.innerWidth < 768) {
        $('#tm-nav ul').addClass('hidden');
    } else {
        $('#tm-nav ul').removeClass('hidden');
    }
}

function initMenuLogic() {
    var tmNav = $('#tm-nav');

    checkAndShowHideMenu();
    window.addEventListener('resize', checkAndShowHideMenu);

    $('#menu-toggle').click(function () {
        $('#tm-nav ul').toggleClass('hidden');
    });

    $('#tm-nav ul li').click(function () {
        if (window.innerWidth < 768) {
            $('#tm-nav ul').addClass('hidden');
        }
    });

    $(document).scroll(function () {
        var distanceFromTop = $(document).scrollTop();

        if (distanceFromTop > 100) {
            tmNav.addClass('scroll');
        } else {
            tmNav.removeClass('scroll');
        }
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}

