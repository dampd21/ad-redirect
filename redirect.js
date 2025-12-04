var SECRET_KEY = "dampd-secret-2025";
var WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbyWzaUUMvN_U8zkP2OO-Iu4jE_nXUZe00jzjKQhMfDhFBu9wDKrqOyN1DeE-JL-VR1n/exec";  // Apps Script WebApp URL
var FINAL_REDIRECT = "https://m.place.naver.com/restaurant/1309812619/home";  // 실제 뒤로 연결할 랜딩 URL

// Fingerprint 수집
async function getFingerprint() {
    return {
        userAgent: navigator.userAgent,
        language: navigator.language,
        screen: {
            width: window.screen.width,
            height: window.screen.height
        },
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
}

// 내 IP 수집
async function getIP() {
    try {
        var res = await fetch("https://api.ipify.org?format=json");
        var json = await res.json();
        return json.ip;
    } catch(e) {
        return "unknown";
    }
}

// URL 파라미터 읽기
function getParam(key) {
    var url = new URL(window.location.href);
    return url.searchParams.get(key);
}

async function main() {
    try {
        var encrypted = getParam("data");
        if (!encrypted) return window.location.href = FINAL_REDIRECT;

        // 암호화 파라미터 복호화
        var decoded = decryptAES(encrypted, SECRET_KEY);

        // fingerprint + IP 추가
        var fingerprint = await getFingerprint();
        var ip = await getIP();

        var payload = {
            timestamp: new Date().toISOString(),
            ip: ip,
            fingerprint: fingerprint,
            adInfo: decoded
        };

        // 구글시트 WebApp으로 전송
        fetch(WEBHOOK_URL, {
            method: "POST",
            contentType: "application/json",
            body: JSON.stringify(payload)
        });

        // 화면 숨김
        document.body.style.display = "none";

        // 0.3초 뒤 실제 랜딩으로 이동
        setTimeout(() => {
            window.location.href = FINAL_REDIRECT;
        }, 300);

    } catch(e) {
        window.location.href = FINAL_REDIRECT;
    }
}

main();
