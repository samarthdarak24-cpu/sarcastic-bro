import json, os

base = os.path.dirname(os.path.abspath(__file__))

extra_keys = {
    "en": {
        "page": {
            "see_how": "See How Farmers Are",
            "transforming": "Transforming Their Business",
            "watch_stories": "Watch real stories from farmers across India who increased their income by 40% using our platform.",
            "direct_access": "Direct access to 10,000+ verified buyers",
            "ai_price": "AI-powered price recommendations",
            "realtime_logistics": "Real-time logistics tracking",
            "secure_payment": "Secure payment guarantee",
            "ai_price_intel_desc": "Get real-time market insights and fair price recommendations based on demand-supply analytics.",
            "quality_verify_desc": "AI-powered crop quality detection with blockchain traceability for every product.",
            "smart_logistics_desc": "Track shipments in real-time with optimized routes and delivery predictions.",
            "direct_market_desc": "Connect with 10,000+ verified buyers without any middlemen or commission.",
            "advanced_features": "Advanced Features for Modern Agriculture",
            "cutting_edge": "Cutting-edge technology to maximize your profits",
            "create_account_desc": "Quick registration with KYC verification in 2 minutes",
            "list_browse_desc": "Farmers list produce, buyers discover quality products",
            "trade_track_desc": "Complete transactions with real-time tracking"
        }
    },
    "hi": {
        "page": {
            "see_how": "देखें कैसे किसान",
            "transforming": "अपने व्यवसाय को बदल रहे हैं",
            "watch_stories": "भारत भर के किसानों की असली कहानियां देखें जिन्होंने हमारे प्लेटफॉर्म से अपनी आय 40% बढ़ाई।",
            "direct_access": "10,000+ सत्यापित खरीदारों तक सीधी पहुंच",
            "ai_price": "AI-संचालित मूल्य सिफारिशें",
            "realtime_logistics": "रियल-टाइम लॉजिस्टिक्स ट्रैकिंग",
            "secure_payment": "सुरक्षित भुगतान गारंटी",
            "ai_price_intel_desc": "मांग-आपूर्ति विश्लेषण के आधार पर रियल-टाइम बाज़ार इनसाइट्स और उचित मूल्य सिफारिशें प्राप्त करें।",
            "quality_verify_desc": "हर उत्पाद के लिए ब्लॉकचेन ट्रेसेबिलिटी के साथ AI-संचालित फसल गुणवत्ता पहचान।",
            "smart_logistics_desc": "अनुकूलित मार्गों और डिलीवरी पूर्वानुमान के साथ रियल-टाइम में शिपमेंट ट्रैक करें।",
            "direct_market_desc": "बिना किसी बिचौलिए या कमीशन के 10,000+ सत्यापित खरीदारों से जुड़ें।",
            "advanced_features": "आधुनिक कृषि के लिए उन्नत सुविधाएं",
            "cutting_edge": "आपके मुनाफे को अधिकतम करने के लिए अत्याधुनिक तकनीक",
            "create_account_desc": "2 मिनट में KYC सत्यापन के साथ त्वरित पंजीकरण",
            "list_browse_desc": "किसान उपज सूचीबद्ध करें, खरीदार गुणवत्तापूर्ण उत्पाद खोजें",
            "trade_track_desc": "रियल-टाइम ट्रैकिंग के साथ लेनदेन पूर्ण करें"
        }
    },
    "mr": {
        "page": {
            "see_how": "पहा शेतकरी कसे",
            "transforming": "त्यांचा व्यवसाय बदलत आहेत",
            "watch_stories": "भारतभरातील शेतकऱ्यांच्या खऱ्या कहाण्या पहा ज्यांनी आमच्या प्लॅटफॉर्मवर त्यांचे उत्पन्न 40% वाढवले.",
            "direct_access": "10,000+ सत्यापित खरेदीदारांपर्यंत थेट प्रवेश",
            "ai_price": "AI-चालित किंमत शिफारसी",
            "realtime_logistics": "रिअल-टाइम लॉजिस्टिक्स ट्रॅकिंग",
            "secure_payment": "सुरक्षित पेमेंट हमी",
            "ai_price_intel_desc": "मागणी-पुरवठा विश्लेषणावर आधारित रिअल-टाइम बाजार इनसाइट्स आणि योग्य किंमत शिफारसी मिळवा.",
            "quality_verify_desc": "प्रत्येक उत्पादनासाठी ब्लॉकचेन ट्रेसेबिलिटीसह AI-चालित पीक गुणवत्ता ओळख.",
            "smart_logistics_desc": "ऑप्टिमाइझ्ड मार्ग आणि वितरण अंदाजांसह रिअल-टाइममध्ये शिपमेंट ट्रॅक करा.",
            "direct_market_desc": "कोणत्याही दलालाशिवाय किंवा कमिशनशिवाय 10,000+ सत्यापित खरेदीदारांशी जोडा.",
            "advanced_features": "आधुनिक शेतीसाठी प्रगत वैशिष्ट्ये",
            "cutting_edge": "तुमचा नफा जास्तीत जास्त वाढवण्यासाठी अत्याधुनिक तंत्रज्ञान",
            "create_account_desc": "2 मिनिटांत KYC पडताळणीसह जलद नोंदणी",
            "list_browse_desc": "शेतकरी उत्पादने सूचीबद्ध करा, खरेदीदार गुणवत्ता उत्पादने शोधा",
            "trade_track_desc": "रिअल-टाइम ट्रॅकिंगसह व्यवहार पूर्ण करा"
        }
    }
}

for lang in ["en", "hi", "mr"]:
    fp = os.path.join(base, "public", "locales", lang, "translation.json")
    with open(fp, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    for ns, keys in extra_keys[lang].items():
        if ns not in data:
            data[ns] = {}
        for k, v in keys.items():
            data[ns][k] = v
    
    with open(fp, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Updated {lang} — total keys: {sum(len(v) for v in data.values())}")

print("🎉 Done!")
