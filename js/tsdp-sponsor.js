//tsdp-sponsor.js
const community_sponsors = [
    {
        img: "img/sponsor/das-family.png",
        family: "Das Family",
        level: "Grand Sponsor",
        className: "grand-sponsor"
    },
    {
        img: "img/sponsor/madhurimamoulik.png",
        family: "Moulik Family",
        level: "Gold Sponsor",
        className: "gold-sponsor"
    },
    {
        img: "img/sponsor/bag-family.png",
        hoverImg: "img/sponsor/full/bag-family-full.jpg",
        family: "Bag Family",
        level: "Grand Sponsor",
        className: "grand-sponsor"
    },
    {
        img: "img/sponsor/Roy-family.png",
        hoverImg: "img/sponsor/full/Roy-family-full.jpg",
        family: "Roy Family",
        level: "Grand Sponsor",
        className: "grand-sponsor"
    },
    {
        img: "img/sponsor/Chandrama-Chakrabarti-family.png",
        hoverImg: "img/sponsor/Chandrama-Chakrabarti-family.png",
        family: "Chakrabarti Family",
        level: "Grand Sponsor",
        className: "grand-sponsor"
    },
    {
        img: "img/sponsor/Sumana-Sinha.png",
        hoverImg: "img/sponsor/full/Sumana-Sinha-full.jpg",
        family: "Sumana Sinha",
        level: "Sponsor",
        className: "general-sponsor"
    },
    {
        img: "img/sponsor/Banerjee-family.png",
        hoverImg: "img/sponsor/full/Banerjee-family-full.jpg",
        family: "Banerjee Family",
        level: "Grand Sponsor",
        className: "grand-sponsor"
    },
    {
        img: "img/sponsor/deb-family.png",
        hoverImg: "img/sponsor/full/deb-family-full.jpg",
        family: "Deb Family",
        level: "Grand Sponsor",
        className: "grand-sponsor"
    },
    {
        img: "img/sponsor/ghosh-family.png",
        hoverImg: "img/sponsor/full/ghosh-family-full.jpg",
        family: "Ghosh Family",
        level: "Grand Sponsor",
        className: "grand-sponsor"
    }
];

const corporate_sponsors = [
    { img: "img/sponsor-1.jpg", family: "Sponsor Name", level: "Sponsor Gold", className: "gold-sponsor" },
    { img: "img/sponsor-2.jpg", family: "Sponsor Name", level: "Sponsor Silver", className: "silver-sponsor" },
    { img: "img/sponsor-3.jpg", family: "Sponsor Name", level: "Sponsor Platinum", className: "platinum-sponsor" },
    { img: "img/sponsor-4.jpg", family: "Sponsor Name", level: "Sponsor Bronze", className: "bronze-sponsor" },
    { img: "img/sponsor-5.jpg", family: "Sponsor Name", level: "Sponsor Grand", className: "grand-sponsor" }
];

function createSponsorHTML(sponsor) {
    const hoverImg = sponsor.hoverImg || sponsor.img;
    return `
        <div class="sponsor-scroll-box-sponsor-wrapper" data-img="${sponsor.img}" data-hover="${hoverImg}">
            <div class="sponsor-scroll-box" style="background-image:url('${sponsor.img}')"></div>
            <div class="sponsor-caption ${sponsor.className}">${sponsor.family}</div>
            <div class="sub-sponsor-caption ${sponsor.className}">${sponsor.level}</div>
        </div>
    `;
}

function populateSponsors(containerId, sponsor_category) {
    const container = document.getElementById(containerId);
    const content = sponsor_category.map(createSponsorHTML).join('');
    container.innerHTML = content + content; // Repeat for continuous scroll effect
}

populateSponsors('sponsor-scroll-content-top', community_sponsors);
populateSponsors('sponsor-scroll-content-bottom', corporate_sponsors);

const hoverFrame = document.getElementById('hoverFrame');
const frameOverlay = document.getElementById('frameOverlay');

function pauseAnimations() {
    document.getElementById('sponsor-scroll-content-top').style.animationPlayState = 'paused';
    document.getElementById('sponsor-scroll-content-bottom').style.animationPlayState = 'paused';
}

function resumeAnimations() {
    document.getElementById('sponsor-scroll-content-top').style.animationPlayState = 'running';
    document.getElementById('sponsor-scroll-content-bottom').style.animationPlayState = 'running';
}
let autoCloseTimeout; // global timer reference

function showHover(box) {
    const hoverImgUrl = box.dataset.hover;
    if (hoverImgUrl) {
        hoverFrame.style.backgroundImage = `url(${hoverImgUrl})`;
        hoverFrame.style.display = 'block';
        frameOverlay.style.display = 'block';
        pauseAnimations();

        clearTimeout(autoCloseTimeout); // clear existing timer
        autoCloseTimeout = setTimeout(() => {
            hideHover();
        }, 10000); // 10 seconds
    }
}

function hideHover() {
    hoverFrame.style.display = 'none';
    frameOverlay.style.display = 'none';
    resumeAnimations();
    clearTimeout(autoCloseTimeout); // stop any running timer
}

document.addEventListener("DOMContentLoaded", function () {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    document.querySelectorAll('.sponsor-scroll-box-sponsor-wrapper').forEach(box => {
        if (isTouchDevice) {
            box.addEventListener('touchstart', function (e) {
                e.stopPropagation(); // Prevent bubbling to document
                showHover(box);
            });
        } else {
            box.addEventListener('mouseenter', () => showHover(box));
            box.addEventListener('mouseleave', hideHover);
        }
    });

    if (isTouchDevice) {
        document.addEventListener('touchstart', function (e) {
            const isSponsorBox = e.target.closest('.sponsor-scroll-box-sponsor-wrapper');
            if (!isSponsorBox) {
                hideHover();
            }
        });
    }
});