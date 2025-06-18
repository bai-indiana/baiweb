// sponsor.js

const community_sponsors = [
    {
        img: "img/sponsor/das-family.png",
        family: "Das Family",
        level: "Grand Sponsor",
        className: "grand-sponsor"
    },
    {
        img: "img/sponsor/madhurimamoulik.png",
        family: "Madhuri Mamoulik",
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
        img: "img/sponsor-3.jpg",
        family: "Sponsor Family",
        level: "Bronze Sponsor",
        className: "bronze-sponsor"
    }
];

const corporate_sponsors = [
    { img: "img/sponsor-1.jpg", family: "Sponsor Name", level: "Sponsor Type", className: "gold-sponsor" },
    { img: "img/sponsor-2.jpg", family: "Sponsor Name", level: "Sponsor Type", className: "silver-sponsor" },
    { img: "img/sponsor-3.jpg", family: "Sponsor Name", level: "Sponsor Type", className: "platinum-sponsor" },
    { img: "img/sponsor-4.jpg", family: "Sponsor Name", level: "Sponsor Type", className: "bronze-sponsor" },
    { img: "img/sponsor-5.jpg", family: "Sponsor Name", level: "Sponsor Type", className: "grand-sponsor" }
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
    container.innerHTML = content + content;
}

populateSponsors('sponsor-scroll-content-top', community_sponsors);
populateSponsors('sponsor-scroll-content-bottom', corporate_sponsors);

const hoverFrame = document.getElementById('hoverFrame');
const frameOverlay = document.getElementById('frameOverlay');

document.addEventListener("DOMContentLoaded", function () {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    const hoverFrame = document.getElementById('hoverFrame');      // Make sure this exists
    const frameOverlay = document.getElementById('frameOverlay');  // Make sure this exists

    const showHover = (box) => {
        const hoverImgUrl = box.dataset.hover;
        if (hoverImgUrl) {
            hoverFrame.style.backgroundImage = `url(${hoverImgUrl})`;
            hoverFrame.style.display = 'block';
            frameOverlay.style.display = 'block';
            pauseAnimations();
        }
    };

    const hideHover = () => {
        hoverFrame.style.display = 'none';
        frameOverlay.style.display = 'none';
        resumeAnimations();
    };

    document.querySelectorAll('.sponsor-scroll-box-sponsor-wrapper').forEach(box => {
        // Desktop: hover events
        box.addEventListener('mouseenter', () => showHover(box));
        box.addEventListener('mouseleave', hideHover);

        // Mobile: touch events
        box.addEventListener('touchstart', () => showHover(box), { passive: true });
        //box.addEventListener('touchend', hideHover, { passive: true });
        box.addEventListener('touchcancel', hideHover, { passive: true });
    });
});


function pauseAnimations() {
    document.getElementById('sponsor-scroll-content-top').style.animationPlayState = 'paused';
    document.getElementById('sponsor-scroll-content-bottom').style.animationPlayState = 'paused';
}

function resumeAnimations() {
    document.getElementById('sponsor-scroll-content-top').style.animationPlayState = 'running';
    document.getElementById('sponsor-scroll-content-bottom').style.animationPlayState = 'running';
}
