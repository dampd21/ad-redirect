var SECRET_KEY = "dampd-secret-2025";

function decryptAES(cipherText, secretKey) {
    var bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
    var decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedText);
}
