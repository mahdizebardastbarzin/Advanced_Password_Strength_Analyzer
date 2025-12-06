/* ---------------------------
   Ultra Intelligence Engine  
   Cyberpunk + Matrix Shader
---------------------------- */

const passwordInput = document.getElementById("passwordInput");
const scoreBar = document.getElementById("scoreBar");
const strengthLevel = document.getElementById("strengthLevel");

const metrics = {
    length: document.getElementById("m_length"),
    variety: document.getElementById("m_variety"),
    patterns: document.getElementById("m_patterns"),
    sequences: document.getElementById("m_sequences"),
    symbolPower: document.getElementById("m_symbolpower"),

    h1: document.getElementById("h1"),
    h2: document.getElementById("h2"),
    h3: document.getElementById("h3"),
    h4: document.getElementById("h4")
};

const scoreCells = {
    length: document.getElementById("lenScore"),
    variety: document.getElementById("upperScore"),
    patterns: document.getElementById("patternScore"),
    sequences: document.getElementById("sequenceScore"),
    symbolPower: document.getElementById("symbolScore")
};

const timeCells = {
    normal: document.getElementById("t1"),
    blackhat: document.getElementById("t2"),
    gov: document.getElementById("t3"),
    nsa: document.getElementById("t4"),
};

/* قدرت سخت‌افزاری */
const hardwarePowers = {
    normal: 1e8,       // 100M/s
    blackhat: 5e9,     // 5B/s
    gov: 1e11,         // 100B/s
    nsa: 1e12          // 1T/s
};

/* تشخیص نوع حمله */
function detectAttackMode(pw) {
    const dictWords = ["password", "admin", "love", "test", "qwerty", "welcome"];
    const lower = pw.toLowerCase();

    if (dictWords.includes(lower)) return "Dictionary Attack";
    if (/^[a-z]+$/.test(pw)) return "Bruteforce Basic";
    if (/^[0-9]+$/.test(pw)) return "Bruteforce Digits";
    if (/^(123|abc|qwe)/i.test(pw)) return "Pattern Attack";
    if (/^[A-Za-z0-9]+$/.test(pw)) return "Hybrid Mode";
    return "AI-Smart Attack";
}

/* تبدیل زمان به فرمت انسانی */
function humanTime(seconds) {
    if (seconds < 1) return "کمتر از ۱ ثانیه";
    const units = [
        { s: 31536000, n: "سال" },
        { s: 86400, n: "روز" },
        { s: 3600, n: "ساعت" },
        { s: 60, n: "دقیقه" }
    ];
    for (let u of units) {
        if (seconds >= u.s) return (seconds / u.s).toFixed(1) + " " + u.n;
    }
    return seconds.toFixed(1) + " ثانیه";
}

/* محاسبه تعداد رمزهای ممکن */
function totalCombinations(pw) {
    let chars = 0;
    if (/[0-9]/.test(pw)) chars += 10;
    if (/[a-z]/.test(pw)) chars += 26;
    if (/[A-Z]/.test(pw)) chars += 26;
    if (/[^A-Za-z0-9]/.test(pw)) chars += 32;
    return Math.pow(chars, pw.length);
}

/* نوارها */
function animateBar(element, val) {
    element.style.width = val + "%";
}

/* سطح امنیت */
function getStrength(score) {
    if (score < 25) return "خیلی ضعیف ⚠️";
    if (score < 50) return "ضعیف";
    if (score < 70) return "متوسط";
    if (score < 85) return "قوی";
    return "خیلی قوی 🔥";
}

/* تحلیل کامل رمز */
function analyzePassword(pw) {
    if (!pw) {
        scoreBar.style.width = "0%";
        strengthLevel.innerText = "";
        for (let key in scoreCells) scoreCells[key].innerText = 0;
        for (let key in metrics) animateBar(metrics[key], 0);
        return;
    }

    /* محاسبه امتیازها */
    const lengthScore = Math.min(pw.length * 7, 30);
    const varietyScore =
        (/[a-z]/.test(pw) ? 10 : 0) +
        (/[A-Z]/.test(pw) ? 10 : 0) +
        (/[0-9]/.test(pw) ? 10 : 0) +
        (/[^A-Za-z0-9]/.test(pw) ? 20 : 0);
    const hasPattern = /(123|abc|qwe|password|111|000)/i.test(pw) ? -20 : 0;
    const hasSequences = /(aaa|bbb|111|222)/i.test(pw) ? -15 : 0;
    const symbolPower = (/[^A-Za-z0-9]/.test(pw) ? 20 : 0);

    const totalScore = Math.max(0, Math.min(lengthScore + varietyScore + symbolPower + hasPattern + hasSequences, 100));

    /* بروزرسانی نوار کلی و سطح امنیت */
    animateBar(scoreBar, totalScore);
    strengthLevel.innerText = getStrength(totalScore);

    /* بروزرسانی نوارها و امتیازهای جدول */
    scoreCells.length.innerText = lengthScore;
    scoreCells.variety.innerText = varietyScore;
    scoreCells.patterns.innerText = hasPattern < 0 ? 100 : 0;
    scoreCells.sequences.innerText = hasSequences < 0 ? 100 : 0;
    scoreCells.symbolPower.innerText = symbolPower;

    animateBar(metrics.length, (lengthScore / 30) * 100);
    animateBar(metrics.variety, (varietyScore / 50) * 100);
    animateBar(metrics.patterns, hasPattern < 0 ? 100 : 0);
    animateBar(metrics.sequences, hasSequences < 0 ? 100 : 0);
    animateBar(metrics.symbolPower, symbolPower);

    /* تشخیص نوع حمله */
    document.getElementById("attackMode").innerText = detectAttackMode(pw);

    /* محاسبه زمان هک */
    const combos = totalCombinations(pw);
    timeCells.normal.innerText = humanTime(combos / hardwarePowers.normal);
    timeCells.blackhat.innerText = humanTime(combos / hardwarePowers.blackhat);
    timeCells.gov.innerText = humanTime(combos / hardwarePowers.gov);
    timeCells.nsa.innerText = humanTime(combos / hardwarePowers.nsa);

    /* نوار سخت افزار */
    animateBar(metrics.h1, Math.min((combos / hardwarePowers.normal) / 50, 100));
    animateBar(metrics.h2, Math.min((combos / hardwarePowers.blackhat) / 50, 100));
    animateBar(metrics.h3, Math.min((combos / hardwarePowers.gov) / 50, 100));
    animateBar(metrics.h4, Math.min((combos / hardwarePowers.nsa) / 50, 100));
}

/* رویداد ورودی */
passwordInput.addEventListener("input", () => {
    analyzePassword(passwordInput.value);
});

// ################################

const attackModeHover = document.getElementById("attackModeHover");
const attackInfoBox = document.getElementById("attackInfoBox");

attackModeHover.addEventListener("mouseenter", () => {
    attackInfoBox.style.display = "block";
});

attackModeHover.addEventListener("mouseleave", () => {
    attackInfoBox.style.display = "none";
});




// گرفتن همه تولتیپ‌ها
document.querySelectorAll('.tooltip').forEach(tooltip => {
    const tip = tooltip.querySelector('.tooltip-text');

    tooltip.addEventListener('mousemove', e => {
        const rect = tooltip.getBoundingClientRect();
        const mouseY = e.clientY;
        const elementMiddle = rect.top + rect.height / 2;

        if (mouseY < elementMiddle) {
            // موس بالای المان → تولتیپ پایین موس
            tip.style.top = '100%';
            tip.style.bottom = 'auto';
            tip.style.marginTop = '8px';
            tip.style.marginBottom = '0';
            tip.style.transform = 'translateY(5px)';
            tip.style.borderColor = 'rgba(0,0,0,0.92) transparent transparent transparent';
            tip.style.setProperty('--arrow-position', 'top');
        } else {
            // موس پایین المان → تولتیپ بالای موس
            tip.style.top = 'auto';
            tip.style.bottom = '100%';
            tip.style.marginTop = '0';
            tip.style.marginBottom = '8px';
            tip.style.transform = 'translateY(-5px)';
            tip.style.borderColor = 'transparent transparent rgba(0,0,0,0.92) transparent';
            tip.style.setProperty('--arrow-position', 'bottom');
        }
    });
});
