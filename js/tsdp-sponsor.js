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
        img: "img/sponsor/Kar-family-Silver.png",
        hoverImg: "img/sponsor/full/Kar-family-full-Silver.jpg",
        family: "Kar Family",
        level: "Silver Sponsor",
        className: "silver-sponsor"
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
    },
    {
        img: "img/sponsor/Sanjay-Gupta.png",
        hoverImg: "img/sponsor/full/Sanjay-Gupta-full.jpg",
        family: "Sanjay Gupta",
        level: "Bronze Sponsor",
        className: "bronze-sponsor"
    },
    {
        img: "img/sponsor/Mukherjee-family.png",
        hoverImg: "img/sponsor/full/Mukherjee-family-full.jpg",
        family: "Mukherjee Family",
        level: "Bronze Sponsor",
        className: "bronze-sponsor"
    },
    {
        img: "img/sponsor/subho-family.png",
        hoverImg: "img/sponsor/full/subho-family-full.jpg",
        family: "Mukherjee family",
        level: "Bronze Sponsor",
        className: "bronze-sponsor"
    },
    {
        img: "img/sponsor/chakrabarti-family.png",
        hoverImg: "img/sponsor/full/chakrabarti-family-full.jpg",
        family: "Chakrabarti family",
        level: "Grand Sponsor",
        className: "grand-sponsor"
    },
    {
        img: "img/sponsor/Mandal-Viswam-family-grand.png",
        hoverImg: "img/sponsor/full/Mandal-Viswam-family-full-grand.jpg",
        family: "Mandal & Viswam family",
        level: "Grand Sponsor",
        className: "grand-sponsor"
    },
    {
        img: "img/sponsor/Mukhopadhyay-family.png",
        hoverImg: "img/sponsor/full/Mukhopadhyay-family-full.jpg",
        family: "Mukhopadhyay family",
        level: "Grand Sponsor",
        className: "grand-sponsor"
    },
    {
        img: "img/sponsor/Bhowmick-family.png",
        hoverImg: "img/sponsor/full/Bhowmick-family-full.jpg",
        family: "Bhowmick family",
        level: "Platinum Sponsor",
        className: "platinum-sponsor"
    },
    {
        img: "img/sponsor/Dasgupta-family.png",
        hoverImg: "img/sponsor/full/Dasgupta-family-full.jpg",
        family: "Dasgupta family",
        level: "Grand Sponsor",
        className: "grand-sponsor"
    },
    {
        img: "img/sponsor/Chatterjee-family.png",
        hoverImg: "img/sponsor/full/Chatterjee-family-full.jpg",
        family: "Chatterjee family",
        level: "Bronze Sponsor",
        className: "bronze-sponsor"
    },
    {
        img: "img/sponsor/Banerjee-family-gold.png",
        hoverImg: "img/sponsor/full/Banerjee-family-full-gold.jpg",
        family: "Banerjee family",
        level: "Gold Sponsor",
        className: "gold-sponsor"
    },
    {
        img: "img/sponsor/Ghosh-family-contributor.png",
        hoverImg: "img/sponsor/full/Ghosh-family-full-contributor.jpg",
        family: "Ghosh family",
        level: "Sponsor",
        className: "general-sponsor"
    },
    {
        img: "img/sponsor/Mitra-family-Grand.png",
        hoverImg: "img/sponsor/full/Mitra-family-full-Grand.jpg",
        family: "Mitra family",
        level: "Grand Sponsor",
        className: "grand-sponsor"
    },
    {
        img: "img/sponsor/Dey-family-Platinum.png",
        hoverImg: "img/sponsor/full/Dey-family-full-Platinum.jpg",
        family: "Dey family",
        level: "Platinum Sponsor",
        className: "platinum-sponsor"
    },
    {
        img: "img/sponsor/Kar-family-sponsor.png",
        hoverImg: "img/sponsor/full/Kar-family-full-sponsor.jpg",
        family: "Kar family",
        level: "Sponsor",
        className: "general-sponsor"
    },
    {
        img: "img/sponsor/Saha-family-Grand.png",
        hoverImg: "img/sponsor/full/Saha-family-full-Grand.jpg",
        family: "Saha family",
        level: "Grand Sponsor",
        className: "grand-sponsor"
    },
    {
        img: "img/sponsor/Bhattacharjee-family-Bronze.png",
        hoverImg: "img/sponsor/full/Bhattacharjee-family-full-Bronze.jpg",
        family: "Bhattacharjee family",
        level: "Bronze Sponsor",
        className: "bronze-sponsor"
    },
    {
        img: "img/sponsor/Ghosh-family-Bronze.png",
        hoverImg: "img/sponsor/full/Ghosh-family-full-Bronze.jpg",
        family: "Ghosh family",
        level: "Bronze Sponsor",
        className: "bronze-sponsor"
    },
    {
        img: "img/sponsor/Roy-family-Bronze.png",
        hoverImg: "img/sponsor/full/Roy-family-full-Bronze.jpg",
        family: "Roy family",
        level: "Bronze Sponsor",
        className: "bronze-sponsor"
    },
    {
        img: "img/sponsor/Das-family-Bronze.png",
        hoverImg: "img/sponsor/full/Das-family-full-Bronze.jpg",
        family: "Das family",
        level: "Bronze Sponsor",
        className: "bronze-sponsor"
    },
    {
        img: "img/sponsor/Shaw-family-Silver.png",
        hoverImg: "img/sponsor/full/Shaw-family-full-Silver.jpg",
        family: "Shaw Family",
        level: "Silver Sponsor",
        className: "silver-sponsor"
    },
    {
        img: "img/sponsor/Manna-family-Bronze.png",
        hoverImg: "img/sponsor/full/Manna-family-full-Bronze.jpg",
        family: "Manna family",
        level: "Bronze Sponsor",
        className: "bronze-sponsor"
    },
    {
        img: "img/sponsor/Dutta-Family-Bronze.png",
        hoverImg: "img/sponsor/full/Dutta-Family-full-Bronze.jpg",
        family: "Dutta family",
        level: "Bronze Sponsor",
        className: "bronze-sponsor"
    },
    {
        img: "img/sponsor/Saha-family-Bronze.png",
        hoverImg: "img/sponsor/full/Saha-family-full-Bronze.jpg",
        family: "Saha family",
        level: "Bronze  Sponsor",
        className: "bronze-sponsor"
    },
    {
        img: "img/sponsor/Rathmann-Family-Gold.png",
        hoverImg: "img/sponsor/full/Rathmann-Family-full-Gold.jpg",
        family: "Rathmann  family",
        level: "Bronze Sponsor",
        className: "bronze-sponsor"
    }
];

const corporate_sponsors = [
    { 
        img: "img/sponsor/Beenu-Sikabd-Corporate-sponsor-250.png",
        hoverImg: "img/sponsor/full/Beenu-Sikabd-Corporate-sponsor-full-250.jpg",
        family: "Beenu Sikabd", 
        level: "Sponsor", 
        className: "general-sponsor" 
    },
    { 
        img: "img/sponsor/Patel-IN-AD-2000.png",
        hoverImg: "img/sponsor/full/Patel-IN-AD-2000.jpg",
        family: "Patel", 
        level: "Platinum Sponsor", 
        className: "platinum-sponsor" 
    }
];

// New: Filter exclusive grand sponsors
const exclusive_grand_sponsors = community_sponsors.filter(s => s.level === "Grand Sponsor");


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