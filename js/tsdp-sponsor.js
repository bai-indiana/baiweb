// sponsor.js

const community_sponsors = [
    {
        img: "../img/sponsor/das-family.png",
        family: "Das Family",
        level: "Grand Sponsor",
        className: "grand-sponsor"
    },
    {
        img: "../img/sponsor/madhurimamoulik.png",
        family: "Madhuri Mamoulik",
        level: "Gold Sponsor",
        className: "gold-sponsor"
    },
    {
        img: "../img/sponsor/bag-family.png",
        hoverImg: "../img/sponsor/bag-family-full.jpg",
        family: "Bag Family",
        level: "Grand Sponsor",
        className: "grand-sponsor"
    },
    {
        img: "../img/sponsor-1.jpg",
        family: "Sponsor Family",
        level: "Platinum Sponsor",
        className: "platinum-sponsor"
    },
    {
        img: "../img/sponsor-2.jpg",
        family: "Sponsor Family",
        level: "Silver Sponsor",
        className: "silver-sponsor"
    },
    {
        img: "../img/sponsor-3.jpg",
        family: "Sponsor Family",
        level: "Bronze Sponsor",
        className: "bronze-sponsor"
    }
];

const corporate_sponsors = [
    { img: "../img/sponsor-1.jpg", family: "Sponsor Name", level: "Sponsor Type", className: "gold-sponsor" },
    { img: "../img/sponsor-2.jpg", family: "Sponsor Name", level: "Sponsor Type", className: "silver-sponsor" },
    { img: "../img/sponsor-3.jpg", family: "Sponsor Name", level: "Sponsor Type", className: "platinum-sponsor" },
    { img: "../img/sponsor-4.jpg", family: "Sponsor Name", level: "Sponsor Type", className: "bronze-sponsor" },
    { img: "../img/sponsor-5.jpg", family: "Sponsor Name", level: "Sponsor Type", className: "grand-sponsor" }
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
    document.querySelectorAll('.sponsor-scroll-box-sponsor-wrapper').forEach(box => {
        box.addEventListener('mouseenter', () => {
            const hoverImgUrl = box.dataset.hover;
            if (hoverImgUrl) {
                hoverFrame.style.backgroundImage = `url(${hoverImgUrl})`;
                hoverFrame.style.display = 'block';
                frameOverlay.style.display = 'block';
                pauseAnimations();
            }
        });
        box.addEventListener('mouseleave', () => {
            hoverFrame.style.display = 'none';
            frameOverlay.style.display = 'none';
            resumeAnimations();
        });
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
