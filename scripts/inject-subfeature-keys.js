const fs = require('fs');
const path = require('path');

const lang = process.argv[2];
const baseDir = 'c:/Users/darak/Downloads/mvpm hackathon/apps/web/public/locales';
const filePath = path.join(baseDir, lang, 'translation.json');

if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
}

const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const newKeys = {
  "crops": {
    "wheat": lang === 'en' ? "Wheat" : (lang === 'hi' ? "गेहूँ" : "गहू"),
    "rice": lang === 'en' ? "Rice" : (lang === 'hi' ? "चावल" : "तांदूळ"),
    "tomato": lang === 'en' ? "Tomato" : (lang === 'hi' ? "टमाटर" : "टोमॅटो"),
    "onion": lang === 'en' ? "Onion" : (lang === 'hi' ? "प्याज" : "कांदा"),
    "turmeric": lang === 'en' ? "Turmeric" : (lang === 'hi' ? "हल्दी" : "हळद"),
    "basmati_rice": lang === 'en' ? "Basmati Rice" : (lang === 'hi' ? "बासमती चावल" : "बासमती तांदूळ"),
    "organic_spices": lang === 'en' ? "Organic Spices" : (lang === 'hi' ? "जैविक मसाले" : "सेंद्रिय मसाले"),
    "fresh_mangoes": lang === 'en' ? "Fresh Mangoes" : (lang === 'hi' ? "ताजे आम" : "ताजे आंबे"),
    "cashew_nuts": lang === 'en' ? "Cashew Nuts" : (lang === 'hi' ? "काजू" : "काजू")
  },
  "mandis": {
    "indore": lang === 'en' ? "Indore Mandi" : (lang === 'hi' ? "इंदौर मंडी" : "इंदूर मंडी"),
    "karnal": lang === 'en' ? "Karnal Mandi" : (lang === 'hi' ? "करनाल मंडी" : "कर्नाल मंडी"),
    "azadpur": lang === 'en' ? "Azadpur Mandi" : (lang === 'hi' ? "आजादपुर मंडी" : "आझादपूर मंडी"),
    "lasalgaon": lang === 'en' ? "Lasalgaon Mandi" : (lang === 'hi' ? "लासलगांव मंडी" : "लासलगाव मंडी"),
    "erode": lang === 'en' ? "Erode Mandi" : (lang === 'hi' ? "इरोड मंडी" : "इरोड मंडी")
  },
  "destinations": {
    "uae": lang === 'en' ? "United Arab Emirates" : (lang === 'hi' ? "संयुक्त अरब अमीरात" : "संयुक्त अरब अमिराती"),
    "germany": lang === 'en' ? "Germany" : (lang === 'hi' ? "जर्मनी" : "जर्मनी"),
    "uk": lang === 'en' ? "United Kingdom" : (lang === 'hi' ? "यूनाइटेड किंगडम" : "युनायटेड किंगडम"),
    "vietnam": lang === 'en' ? "Vietnam" : (lang === 'hi' ? "वियतनाम" : "व्हिएतनाम"),
    "dubai": lang === 'en' ? "Dubai Market" : (lang === 'hi' ? "दुबई बाजार" : "दुबई बाजार"),
    "hamburg": lang === 'en' ? "Hamburg Market" : (lang === 'hi' ? "हैमबर्ग बाजार" : "हॅम्बर्ग बाजार"),
    "london": lang === 'en' ? "London Market" : (lang === 'hi' ? "लंदन बाजार" : "लंडन बाजार"),
    "ho_chi_minh": lang === 'en' ? "Ho Chi Minh Market" : (lang === 'hi' ? "हो ची मिन्ह बाजार" : "हो ची मिन्ह बाजार")
  },
  "metrics": {
    "insights": lang === 'en' ? "insights" : (lang === 'hi' ? "इनसाइट्स" : "इनसाइट्स"),
    "accuracy": lang === 'en' ? "accuracy" : (lang === 'hi' ? "सटीकता" : "अचूकता"),
    "products": lang === 'en' ? "products" : (lang === 'hi' ? "उत्पाद" : "उत्पादने"),
    "active": lang === 'en' ? "active" : (lang === 'hi' ? "सक्रिय" : "सक्रिय"),
    "orders": lang === 'en' ? "orders" : (lang === 'hi' ? "ऑर्डर" : "ऑर्डर"),
    "delivered": lang === 'en' ? "delivered" : (lang === 'hi' ? "वितरित" : "वितरित"),
    "balance": lang === 'en' ? "balance" : (lang === 'hi' ? "शेष" : "शिल्लक"),
    "pending": lang === 'en' ? "pending" : (lang === 'hi' ? "लंबित" : "लंबित"),
    "won": lang === 'en' ? "won" : (lang === 'hi' ? "जीते" : "जिंकले"),
    "score": lang === 'en' ? "score" : (lang === 'hi' ? "स्कोर" : "स्कोर"),
    "verified": lang === 'en' ? "verified" : (lang === 'hi' ? "सत्यापित" : "सत्यापित"),
    "traced": lang === 'en' ? "traced" : (lang === 'hi' ? "ट्रॅक किया गया" : "ट्रेस केले"),
    "compliant": lang === 'en' ? "compliant" : (lang === 'hi' ? "अनुपालन" : "अनुपालक"),
    "scans": lang === 'en' ? "scans" : (lang === 'hi' ? "स्कॅन" : "स्कॅन"),
    "grade": lang === 'en' ? "grade" : (lang === 'hi' ? "ग्रेड" : "श्रेणी"),
    "alerts": lang === 'en' ? "alerts" : (lang === 'hi' ? "अलर्ट" : "सतर्कता"),
    "chats": lang === 'en' ? "chats" : (lang === 'hi' ? "चैट" : "चॅट")
  },
  "activity": {
    "harvest_ready": lang === 'en' ? "Harvest Ready" : (lang === 'hi' ? "कटाई के लिए तैयार" : "कापणीसाठी तयार"),
    "new_order": lang === 'en' ? "New Order" : (lang === 'hi' ? "नया ऑर्डर" : "नवीन ऑर्डर"),
    "weather_alert": lang === 'en' ? "Weather Alert" : (lang === 'hi' ? "मौसम की चेतावनी" : "हवामान सतर्कता"),
    "harvest_desc": lang === 'en' ? "{{crop}} - {{field}} ready for harvest" : (lang === 'hi' ? "{{crop}} - {{field}} कटाई के लिए तैयार है" : "{{crop}} - {{field}} कापणीसाठी तयार आहे"),
    "order_desc": lang === 'en' ? "{{crop}} {{quantity}} - #{{id}}" : (lang === 'hi' ? "{{crop}} {{quantity}} - #{{id}}" : "{{crop}} {{quantity}} - #{{id}}"),
    "weather_desc": lang === 'en' ? "Light rain expected tomorrow" : (lang === 'hi' ? "कल हल्की बारिश की संभावना है" : "उद्या हलक्या पावसाची शक्यता आहे")
  },
  "units": {
    "acres": lang === 'en' ? "Acres" : (lang === 'hi' ? "एकड़" : "एकर"),
    "utilized": lang === 'en' ? "utilized" : (lang === 'hi' ? "उपयोग किया गया" : "वापरले"),
    "ideal": lang === 'en' ? "Ideal" : (lang === 'hi' ? "आदर्श" : "आदर्श"),
    "index": lang === 'en' ? "Index" : (lang === 'hi' ? "इंडेक्स" : "इंडेक्स"),
    "per_qtl": lang === 'en' ? "/ qtl" : (lang === 'hi' ? "/ क्विंटल" : "/ क्विंटल")
  }
};

const merged = { ...data, ...newKeys };
fs.writeFileSync(filePath, JSON.stringify(merged, null, 2), 'utf8');
console.log(`Updated ${lang} translations with sub-feature keys.`);
