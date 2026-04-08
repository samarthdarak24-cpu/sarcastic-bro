const fs = require('fs');

const updateFile = (lang, landingData, commonData, authData, uiData) => {
    const path = `apps/web/public/locales/${lang}/translation.json`;
    if (!fs.existsSync(path)) return;
    const data = JSON.parse(fs.readFileSync(path, 'utf8'));
    data.landing = landingData;
    data.common = commonData;
    data.auth = authData;
    data.language_switcher = uiData.language_switcher;
    data.ai_assistant = uiData.ai_assistant;
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    console.log(`Updated ${lang}`);
};

const commonEN = {
    "currency_symbol": "₹",
    "lakh": "Lakh",
    "privacy": "Privacy Policy",
    "terms": "Terms of Service",
    "cookies": "Cookie Policy",
    "for_farmers": "For Farmers",
    "for_buyers": "For Buyers",
    "pricing": "Pricing",
    "features": "Features",
    "about_us": "About Us",
    "careers": "Careers",
    "blog": "Blog",
    "press_kit": "Press Kit",
    "help_center": "Help Center",
    "contact_us": "Contact Us",
    "api_docs": "API Docs",
    "status": "Status",
    "licenses": "Licenses"
};

const authEN = {
    "login": "Login",
    "register": "Register",
    "logout": "Logout",
    "email": "Email Address",
    "password": "Password",
    "forgot_password": "Forgot Password?",
    "no_account": "Don't have an account?",
    "already_account": "Already have an account?",
    "sign_in": "Sign In",
    "join_title": "Join ODOP Connect",
    "join_subtitle": "Start your agricultural journey today",
    "i_am_a": "I am a",
    "farmer": "Farmer",
    "buyer": "Buyer",
    "full_name": "Full Name",
    "phone": "Phone Number",
    "optional": "Optional",
    "password_req": "PASSWORD REQUIREMENTS:",
    "req_min": "At least 8 characters",
    "req_upper": "One uppercase letter (A-Z)",
    "req_lower": "One lowercase letter (a-z)",
    "req_num": "One number (0-9)",
    "create_account": "Create Account",
    "creating_account": "Creating Account...",
    "email_placeholder": "john@example.com",
    "name_placeholder": "John Doe",
    "phone_placeholder": "+91 98765 43210"
};

const uiEN = {
    "language_switcher": {
        "select": "Select Language"
    },
    "ai_assistant": {
        "title": "AI Assistant",
        "online": "Online",
        "placeholder": "Ask me anything about farming...",
        "analyzing": "Analyzing your request...",
        "listening": "Listening...",
        "recording": "Recording... Click mic to stop",
        "processing": "Processing audio...",
        "error_api": "AI service is not configured. Using fallback responses.",
        "error_limit": "Too many requests. Please wait a moment.",
        "error_conn": "Unable to connect to AI service.",
        "slow_conn": "Slow connection detected. Response may take longer.",
        "quick_actions": "Quick Actions",
        "welcome_farmer": "How can I help you grow today?",
        "welcome_buyer": "How can I help you source today?"
    }
};

const commonHI = {
    "currency_symbol": "₹",
    "lakh": "लाख",
    "privacy": "गोपनीयता नीति",
    "terms": "सेवा की शर्तें",
    "cookies": "कुकी नीति",
    "for_farmers": "किसानों के लिए",
    "for_buyers": "खरीदारों के लिए",
    "pricing": "मूल्य निर्धारण",
    "features": "सुविधाएं",
    "about_us": "हमारे बारे में",
    "careers": "करियर",
    "blog": "ब्लॉग",
    "press_kit": "प्रेस किट",
    "help_center": "सहायता केंद्र",
    "contact_us": "संपर्क करें",
    "api_docs": "API दस्तावेज़",
    "status": "स्थिति",
    "licenses": "लाइसेंस"
};

const authHI = {
    "login": "लॉगिन",
    "register": "पंजीकरण",
    "logout": "लॉगआउट",
    "email": "ईमेल पता",
    "password": "पासवर्ड",
    "forgot_password": "पासवर्ड भूल गए?",
    "no_account": "खाता नहीं है?",
    "already_account": "पहले से ही एक खाता है?",
    "sign_in": "साइन इन करें",
    "join_title": "ODOP कनेक्ट से जुड़ें",
    "join_subtitle": "आज ही अपनी कृषि यात्रा शुरू करें",
    "i_am_a": "मैं एक हूँ",
    "farmer": "किसान",
    "buyer": "खरीदार",
    "full_name": "पूरा नाम",
    "phone": "फ़ोन नंबर",
    "optional": "वैकल्पिक",
    "password_req": "पासवर्ड आवश्यकताएं:",
    "req_min": "कम से कम 8 वर्ण",
    "req_upper": "एक बड़ा अक्षर (A-Z)",
    "req_lower": "एक छोटा अक्षर (a-z)",
    "req_num": "एक संख्या (0-9)",
    "create_account": "खाता बनाएं",
    "creating_account": "खाता बनाया जा रहा है...",
    "email_placeholder": "john@example.com",
    "name_placeholder": "जॉन डो",
    "phone_placeholder": "+91 98765 43210"
};

const uiHI = {
    "language_switcher": {
        "select": "भाषा चुनें"
    },
    "ai_assistant": {
        "title": "AI सहायक",
        "online": "ऑनलाइन",
        "placeholder": "खेती के बारे में कुछ भी पूछें...",
        "analyzing": "आपके अनुरोध का विश्लेषण किया जा रहा है...",
        "listening": "सुन रहा हूँ...",
        "recording": "पंजीकरण... रोकने के लिए माइक पर क्लिक करें",
        "processing": "ऑडियो संसाधित किया जा रहा है...",
        "error_api": "AI सेवा कॉन्फ़िगर नहीं है। वैकल्पिक प्रतिक्रियाओं का उपयोग किया जा रहा है।",
        "error_limit": "बहुत अधिक अनुरोध। कृपया थोड़ी प्रतीक्षा करें।",
        "error_conn": "AI सेवा से जुड़ने में असमर्थ।",
        "slow_conn": "धीमा कनेक्शन मिला। प्रतिक्रिया में अधिक समय लग सकता है।",
        "quick_actions": "त्वरित कार्य",
        "welcome_farmer": "आज मैं आपको आगे बढ़ने में कैसे मदद कर सकता हूँ?",
        "welcome_buyer": "आज मैं आपको सोर्सिंग में कैसे मदद कर सकता हूँ?"
    }
};

const commonMR = {
    "currency_symbol": "₹",
    "lakh": "लाख",
    "privacy": "गोपनीयता धोरण",
    "terms": "सेवा अटी",
    "cookies": "कुकी धोरण",
    "for_farmers": "शेतकऱ्यांसाठी",
    "for_buyers": "खरेदीदारांसाठी",
    "pricing": "किंमत",
    "features": "वैशिष्ट्ये",
    "about_us": "आमच्याबद्दल",
    "careers": "करिअर",
    "blog": "ब्लॉग",
    "press_kit": "प्रेस किट",
    "help_center": "मदत केंद्र",
    "contact_us": "संपर्क साधा",
    "api_docs": "API कागदपत्रे",
    "status": "स्थिती",
    "licenses": "परवाने"
};

const authMR = {
    "login": "लॉगिन",
    "register": "नोंदणी",
    "logout": "लॉगआउट",
    "email": "ईमेल पत्ता",
    "password": "पासवर्ड",
    "forgot_password": "पासवर्ड विसरलात?",
    "no_account": "खाते नाही?",
    "already_account": "आधीच खाते आहे?",
    "sign_in": "साइन इन करा",
    "join_title": "ODOP कनेक्टमध्ये सामील व्हा",
    "join_subtitle": "आजच तुमचा कृषी प्रवास सुरू करा",
    "i_am_a": "मी एक आहे",
    "farmer": "शेतकरी",
    "buyer": "खरेदीदार",
    "full_name": "पूर्ण नाव",
    "phone": "फोन नंबर",
    "optional": "पर्यायी",
    "password_req": "पासवर्ड आवश्यकता:",
    "req_min": "किमान 8 वर्ण",
    "req_upper": "एक मोठे अक्षर (A-Z)",
    "req_lower": "एक लहान अक्षर (a-z)",
    "req_num": "एक संख्या (0-9)",
    "create_account": "खाते तयार करा",
    "creating_account": "खाते तयार करत आहे...",
    "email_placeholder": "john@example.com",
    "name_placeholder": "जॉन डो",
    "phone_placeholder": "+91 98765 43210"
};

const uiMR = {
    "language_switcher": {
        "select": "भाषा निवडा"
    },
    "ai_assistant": {
        "title": "AI सहाय्यक",
        "online": "ऑनलाइन",
        "placeholder": "शेतीबद्दल काहीही विचारा...",
        "analyzing": "तुमच्या विनंतीचे विश्लेषण करत आहे...",
        "listening": "ऐकत आहे...",
        "recording": "रेकॉर्डिंग... थांबवण्यासाठी माइकवर क्लिक करा",
        "processing": "ऑडिओवर प्रक्रिया करत आहे...",
        "error_api": "AI सेवा कॉन्फ़िगर केलेली नाही। पर्यायी प्रतिसादांचा वापर केला जात आहे।",
        "error_limit": "खूप जास्त विनंत्या। कृपया थोडा वेळ थांबा।",
        "error_conn": "AI सेवेशी जोडण्यास असमर्थ।",
        "slow_conn": "मंद कनेक्शन आढळले। प्रतिसादाला जास्त वेळ लागू शकतो।",
        "quick_actions": "त्वरीत कृती",
        "welcome_farmer": "आज मी तुम्हाला प्रगती करण्यास कशी मदत करू शकतो?",
        "welcome_buyer": "आज मी तुम्हाला सोर्सिंगमध्ये कशी मदत करू शकतो?"
    }
};

const enLanding = {
    "get_started": "Get Started",
    "intelligent_sourcing": "Intelligent Sourcing",
    "trade_network": "Trade Network",
    "market_intel": "Market Intelligence",
    "contact": "Contact",
    "ai_demo": {
      "badge": "AI Technology",
      "title": "See AI Quality Detection",
      "subtitle": "In Action",
      "step1": "Upload Crop Image",
      "analyzing": "AI Analyzing...",
      "step2": "Instant AI Results",
      "quality_grade": "Quality Grade",
      "premium_quality": "Premium Quality",
      "confidence": "Confidence",
      "no_defects": "No Defects Detected",
      "recommended_price": "Recommended Price",
      "per_kg": "/kg"
    },
    "animated_hero": {
      "words": ["Sell", "Smarter.", "Buy", "Better."],
      "badge": "AI-Powered AgTech Platform",
      "subtext": "AI-powered marketplace connecting farmers directly with buyers. No middlemen. Fair prices. Real-time logistics.",
      "cta1": "Get Started Free",
      "cta2": "Watch Demo",
      "s1": "Farmers",
      "s2": "Districts",
      "s3": "Quality Score",
      "s4": "Value Traded"
    },
    "hero": {
      "title_part1": "Grow with Confidence.",
      "title_part2": "Trade with ",
      "title_trust": "Trust.",
      "subtitle": "The world-class portal for ODOP products. Direct sourcing, AI-driven quality assurance, and real-time supply chain intelligence for the modern agricultural ecosystem.",
      "farmer_cta": "For Farmers",
      "buyer_cta": "For Buyers",
      "farmers_empowered": "Farmers Empowered",
      "monthly_gmv": "Monthly GMV",
      "quality_accuracy": "Quality Accuracy",
      "ai_powered_farming": "AI-Powered Farmer Hub",
      "ai_powered_farming_desc": "Real-time Grade Analysis & Yield Predictions",
      "estimated_yield": "Estimated Yield",
      "ai_quality_grade": "AI Quality Grade",
      "odop_certified": "ODOP Certified",
      "verified_portal": "Verified Portal"
    },
    "problem": {
      "title": "The Agricultural Challenge",
      "subtitle": "Farmers struggle with direct access to buyers. Middlemen take 30-40% commission. Buyers face quality uncertainty. Supply chain lacks transparency.",
      "middlemen_title": "Middlemen Exploitation",
      "middlemen_desc": "Farmers lose 30-40% of profit to middlemen",
      "quality_title": "Quality Uncertainty",
      "quality_desc": "Buyers have no way to verify product authenticity",
      "opacity_title": "Supply Chain Opacity",
      "opacity_desc": "No transparency from farm to market",
      "logistics_title": "Inefficient Logistics",
      "logistics_desc": "No intelligent matching between products and logistics",
      "stat_commission": "Commission Lost to Middlemen",
      "stat_unsure": "Buyers Unsure of Quality",
      "stat_loss": "Average Farmer Annual Loss"
    },
    "solution": {
      "title": "Our Solution",
      "subtitle": "ODOP Connect eliminates middlemen, ensures quality, and brings transparency",
      "direct_title": "Direct Connection",
      "direct_desc": "Farmers connect directly with buyers, eliminating middlemen and increasing profits",
      "direct_highlight": "↑ 30-40% Higher Profits",
      "quality_title": "Quality Verified",
      "quality_desc": "AI analyzes product quality with 98.5% accuracy using image recognition",
      "quality_highlight": "98.5% Quality Accuracy",
      "transparency_title": "Complete Transparency",
      "transparency_desc": "Blockchain tracks supply chain from farm to buyer ensuring authenticity",
      "transparency_highlight": "Immutable Records",
      "verified": "Verified",
      "blockchain": "Blockchain",
      "this_month": "This Month",
      "orders": "Orders",
      "grade": "Grade",
      "quick_actions": "Quick Actions",
      "ai_grade_btn": "AI Grade",
      "chat_btn": "Chat",
      "fresh_tomatoes": "Fresh Tomatoes",
      "kg_available": "kg available",
      "mockup": {
        "farmer_name": "Rajesh Kumar",
        "farmer_role": "Tomato Farmer"
      }
    },
    "process": {
      "badge": "Simple Process",
      "title": "How It Works",
      "subtitle": "Start selling in 4 easy steps",
      "step1_title": "Sign Up",
      "step1_desc": "Create account in 2 minutes",
      "step2_title": "List Products",
      "step2_desc": "Add crops with AI grading",
      "step3_title": "Connect",
      "step3_desc": "Match with buyers instantly",
      "step4_title": "Get Paid",
      "step4_desc": "Secure blockchain payments"
    },
    "testimonials": {
      "badge": "Success Stories",
      "title": "Farmers Love Us",
      "income_increase": "Income Increase",
      "quality_grade": "Quality Grade",
      "monthly_gmv": "Monthly GMV",
      "quote1": "My income increased by 45% with AI quality grading and direct buyer connections!",
      "quote2": "The AI quality detection is amazing! I get A+ grades consistently.",
      "quote3": "Real-time market prices help me plan better. Blockchain tracking builds trust."
    },
    "features": {
      "badge": "Powerful Features",
      "title": "Everything You Need",
      "subtitle": "Built for modern agricultural commerce",
      "f1_title": "AI Quality Grading",
      "f1_desc": "Instant crop analysis",
      "f2_title": "Real-time Chat",
      "f2_desc": "Connect instantly",
      "f3_title": "Blockchain Verified",
      "f3_desc": "Transparent tracking",
      "f4_title": "Smart Logistics",
      "f4_desc": "Optimized delivery",
      "f5_title": "Demand Forecast",
      "f5_desc": "Predict market trends",
      "f6_title": "Secure Payments",
      "f6_desc": "Safe transactions",
      "f7_title": "Analytics",
      "f7_desc": "Data-driven insights",
      "f8_title": "Multilingual",
      "f8_desc": "Speak your language",
      "f9_title": "Direct Marketplace",
      "f9_desc": "No middlemen"
    },
    "benefits": {
      "badge": "Powerful Benefits",
      "title": "Benefits for Everyone",
      "subtitle": "Empowering both farmers and buyers with cutting-edge technology",
      "for_farmers": "For Farmers",
      "maximize_profits": "Maximize your profits",
      "for_buyers": "For Buyers",
      "quality_guaranteed": "Quality guaranteed",
      "farmer": {
        "income": "40% Higher Income",
        "ai_grading": "Instant AI Grading",
        "pricing": "Real-time Pricing",
        "payments": "Secure Payments",
        "logistics": "Smart Logistics",
        "analytics": "Analytics Dashboard"
      },
      "buyer": {
        "verified": "Verified Quality",
        "direct": "Direct from Farm",
        "flexible": "Flexible Payments",
        "bulk": "Bulk Orders",
        "traceability": "Full Traceability",
        "fast": "Fast Delivery"
      }
    },
    "cta": {
      "badge": "Join 450,000+ Farmers",
      "title": "Ready to Transform Your Agricultural Business?",
      "subtitle": "Join thousands of farmers and buyers who are already experiencing 40% higher profits with AI-powered quality grading and direct marketplace connections.",
      "start_farmer": "Start as Farmer",
      "start_buyer": "Start as Buyer",
      "free_to_join": "Free to Join",
      "no_cc": "No Credit Card Required",
      "setup_5m": "Setup in 5 Minutes"
    },
    "faq": {
      "badge": "Digital Assistant",
      "title": "Got Questions?",
      "ask_farmbot": "Ask FarmBot.",
      "bot_name": "FarmBot AI",
      "bot_status": "Online & Ready to help",
      "bot_message": "I can help you understand our AI grading, payment cycles, and marketplace policies instantly!",
      "still_questions": "Still have questions?",
      "contact_support": "Contact Support",
      "q1": "How does AI quality grading work?",
      "a1": "Our AI analyzes crop images to assign grades (A+, A, B, C) with 98.5% accuracy.",
      "q2": "Is FarmGuard free to use?",
      "a2": "Yes! Registration is free. We charge only 2-3% commission on successful transactions.",
      "q3": "How do I get paid?",
      "a3": "Payments are processed within 24-48 hours through our secure AgriPay system.",
      "q4": "What crops are supported?",
      "a4": "We support 50+ crops including vegetables, fruits, grains, and pulses."
    },
    "footer": {
      "stay_updated": "Stay Updated",
      "newsletter_desc": "Get the latest updates on features, market trends, and success stories.",
      "subscribe": "Subscribe",
      "placeholder": "Enter your email",
      "platform": "Platform",
      "company": "Company",
      "support": "Support",
      "legal": "Legal",
      "rights": "All rights reserved."
    }
};

const hiLanding = {
    "get_started": "शुरू करें",
    "intelligent_sourcing": "इंटेलिजेंट सोर्सिंग",
    "trade_network": "ट्रेड नेटवर्क",
    "market_intel": "बाज़ार इंटेलिजेंस",
    "contact": "संपर्क करें",
    "ai_demo": {
      "badge": "AI तकनीक",
      "title": "AI गुणवत्ता पहचान",
      "subtitle": "कार्रवाई में देखें",
      "step1": "फसल की छवि अपलोड करें",
      "analyzing": "AI विश्लेषण कर रहा है...",
      "step2": "त्वरित AI परिणाम",
      "quality_grade": "गुणवत्ता ग्रेड",
      "premium_quality": "प्रीमियम गुणवत्ता",
      "confidence": "आत्मविश्वास",
      "no_defects": "कोई दोष नहीं मिला",
      "recommended_price": "अनुशंसित मूल्य",
      "per_kg": "/किलो"
    },
    "animated_hero": {
      "words": ["बेचें", "बेहतर।", "खरीदें", "सस्ती।"],
      "badge": "AI-संचालित एगटेक प्लेटफ़ॉर्म",
      "subtext": "किसानों को सीधे खरीदारों से जोड़ने वाला AI-संचालित बाज़ार। कोई बिचौलिया नहीं। उचित मूल्य। रीयल-टाइम रसद।",
      "cta1": "मुफ्त में शुरू करें",
      "cta2": "डेमो देखें",
      "s1": "किसान",
      "s2": "जिले",
      "s3": "गुणवत्ता स्कोर",
      "s4": "व्यापारित मूल्य"
    },
    "hero": {
      "title_part1": "आत्मविश्वास के साथ बढ़ें।",
      "title_part2": "भरोसे के साथ ",
      "title_trust": "व्यापार करें।",
      "subtitle": "ODOP उत्पादों के लिए विश्व स्तरीय पोर्टल। आधुनिक कृषि पारिस्थितिकी तंत्र के लिए प्रत्यक्ष सोर्सिंग, AI-आधारित गुणवत्ता आश्वासन और रीयल-टाइम आपूर्ति श्रृंखला खुफिया।",
      "farmer_cta": "किसानों के लिए",
      "buyer_cta": "खरीदारों के लिए",
      "farmers_empowered": "किसान सशक्त",
      "monthly_gmv": "मासिक GMV",
      "quality_accuracy": "गुणवत्ता सटीकता",
      "ai_powered_farming": "AI-संचालित किसान हब",
      "ai_powered_farming_desc": "रीयल-टाइम ग्रेड विश्लेषण और उपज भविष्यवाणियां",
      "estimated_yield": "अनुमानित उपज",
      "ai_quality_grade": "AI गुणवत्ता ग्रेड",
      "odop_certified": "ODOP प्रमाणित",
      "verified_portal": "सत्यापित पोर्टल"
    },
    "problem": {
      "title": "कृषि चुनौती",
      "subtitle": "किसानों को खरीदारों तक सीधी पहुंच के लिए संघर्ष करना पड़ता है। बिचौलिये 30-40% कमीशन लेते हैं। खरीदारों को गुणवत्ता अनिश्चितता का सामना करना पड़ता है।",
      "middlemen_title": "बिचौलियों द्वारा शोषण",
      "middlemen_desc": "किसान बिचौलियों के कारण 30-40% लाभ खो देते हैं",
      "quality_title": "गुणवत्ता अनिश्चितता",
      "quality_desc": "खरीदारों के पास उत्पाद की प्रामाणिकता को सत्यापित करने का कोई तरीका नहीं है",
      "opacity_title": "आपूर्ति श्रृंखला अस्पष्टता",
      "opacity_desc": "खेत से बाज़ार तक कोई पारदर्शिता नहीं",
      "logistics_title": "अकुशल रसद",
      "logistics_desc": "उत्पादों और रसद के बीच कोई इंटेलिजेंट मिलान नहीं",
      "stat_commission": "बिचौलियों को खोया कमीशन",
      "stat_unsure": "खरीदार गुणवत्ता के बारे में अनिश्चित",
      "stat_loss": "औसत किसान वार्षिक हानि"
    },
    "solution": {
      "title": "हमारा समाधान",
      "subtitle": "ODOP कनेक्ट बिचौलियों को खत्म करता है, गुणवत्ता सुनिश्चित करता है और पारदर्शिता लाता है",
      "direct_title": "सीधा संबंध",
      "direct_desc": "किसान सीधे खरीदारों से जुड़ते हैं, बिचौलियों को खत्म करते हैं और लाभ बढ़ाते हैं",
      "direct_highlight": "↑ 30-40% अधिक लाभ",
      "quality_title": "गुणवत्ता सत्यापित",
      "quality_desc": "AI छवि पहचान का उपयोग करके 98.5% सटीकता के साथ उत्पाद की गुणवत्ता का विश्लेषण करता है",
      "quality_highlight": "98.5% गुणवत्ता सटीकता",
      "transparency_title": "पूर्ण पारदर्शिता",
      "transparency_desc": "ब्लॉकचेन खेत से खरीदार तक आपूर्ति श्रृंखला को ट्रैक करता है",
      "transparency_highlight": "अपरिवर्तनीय रिकॉर्ड",
      "verified": "सत्यापित",
      "blockchain": "ब्लॉकचेन",
      "this_month": "इस महीने",
      "orders": "ऑर्डर",
      "grade": "ग्रेड",
      "quick_actions": "त्वरित कार्य",
      "ai_grade_btn": "AI ग्रेड",
      "chat_btn": "चैट",
      "fresh_tomatoes": "ताज़ा टमाटर",
      "kg_available": "किलो उपलब्ध",
      "mockup": {
        "farmer_name": "राजेश कुमार",
        "farmer_role": "टमाटर किसान"
      }
    },
    "process": {
      "badge": "सरल प्रक्रिया",
      "title": "यह कैसे काम करता है",
      "subtitle": "4 आसान चरणों में बेचना शुरू करें",
      "step1_title": "साइन अप करें",
      "step1_desc": "2 मिनट में खाता बनाएं",
      "step2_title": "उत्पाद सूचीबद्ध करें",
      "step2_desc": "AI ग्रेडिंग के साथ फसलें जोड़ें",
      "step3_title": "जुड़ें",
      "step3_desc": "खरीदारों से तुरंत मिलें",
      "step4_title": "भुगतान प्राप्त करें",
      "step4_desc": "सुरक्षित ब्लॉकचेन भुगतान"
    },
    "testimonials": {
      "badge": "सफलता की कहानियां",
      "title": "किसान हमें प्यार करते हैं",
      "income_increase": "आय में वृद्धि",
      "quality_grade": "गुणवत्ता ग्रेड",
      "monthly_gmv": "मासिक GMV",
      "quote1": "AI गुणवत्ता ग्रेडिंग और प्रत्यक्ष खरीदार कनेक्शन के साथ मेरी आय में 45% की वृद्धि हुई!",
      "quote2": "AI गुणवत्ता पहचान अद्भुत है! मुझे लगातार A+ ग्रेड मिलते हैं।",
      "quote3": "रीयल-टाइम बाज़ार कीमतें मुझे बेहतर योजना बनाने में मदद करती हैं। ब्लॉकचेन ट्रैकिंग विश्वास पैदा करती है।"
    },
    "features": {
      "badge": "शक्तिशाली सुविधाएं",
      "title": "वह सब कुछ जो आपको चाहिए",
      "subtitle": "आधुनिक कृषि वाणिज्य के लिए निर्मित",
      "f1_title": "AI गुणवत्ता ग्रेडिंग",
      "f1_desc": "त्वरित फसल विश्लेषण",
      "f2_title": "रीयल-टाइम चैट",
      "f2_desc": "तुरंत जुड़ें",
      "f3_title": "ब्लॉकचेन सत्यापित",
      "f3_desc": "पारदर्शी ट्रैकिंग",
      "f4_title": "स्मार्ट लॉजिस्टिक्स",
      "f4_desc": "इष्टतम वितरण",
      "f5_title": "मांग पूर्वानुमान",
      "f5_desc": "बाज़ार प्रवृत्तियों की भविष्यवाणी",
      "f6_title": "सुरक्षित भुगतान",
      "f6_desc": "सुरक्षित लेनदेन",
      "f7_title": "एनालिटिक्स",
      "f7_desc": "डाटा-संचालित अंतर्दृष्टि",
      "f8_title": "बहुभाषी",
      "f8_desc": "अपनी भाषा बोलें",
      "f9_title": "प्रत्यक्ष बाज़ार",
      "f9_desc": "कोई बिचौलिया नहीं"
    },
    "benefits": {
      "badge": "शक्तिशाली लाभ",
      "title": "सभी के लिए लाभ",
      "subtitle": "अत्याधुनिक तकनीक के साथ किसानों और खरीदारों दोनों को सशक्त बनाना",
      "for_farmers": "किसानों के लिए",
      "maximize_profits": "अपना लाभ अधिकतम करें",
      "for_buyers": "खरीदारों के लिए",
      "quality_guaranteed": "गुणवत्ता की गारंटी",
      "farmer": {
        "income": "40% अधिक आय",
        "ai_grading": "तत्काल AI ग्रेडिंग",
        "pricing": "रीयल-टाइम मूल्य निर्धारण",
        "payments": "सुरक्षित भुगतान",
        "logistics": "स्मार्ट लॉजिस्टिक्स",
        "analytics": "एनालिटिक्स डैशबोर्ड"
      },
      "buyer": {
        "verified": "सत्यापित गुणवत्ता",
        "direct": "खेत से सीधा",
        "flexible": "लीचीला भुगतान",
        "bulk": "बल्क ऑर्डर",
        "traceability": "पूर्ण पता लगाने की क्षमता",
        "fast": "तेजी से वितरण"
      }
    },
    "cta": {
      "badge": "4,50,000+ किसानों से जुड़ें",
      "title": "अपने कृषि व्यवसाय को बदलने के लिए तैयार हैं?",
      "subtitle": "उन हजारों किसानों और खरीदारों से जुड़ें जो पहले से ही बेहतर लाभ का अनुभव कर रहे हैं।",
      "start_farmer": "किसान के रूप में शुरू करें",
      "start_buyer": "खरीदार के रूप में शुरू करें",
      "free_to_join": "जुड़ने के लिए स्वतंत्र",
      "no_cc": "किसी क्रेडिट कार्ड की आवश्यकता नहीं",
      "setup_5m": "5 मिनट में सेटअप"
    },
    "faq": {
      "badge": "डिजिटल सहायक",
      "title": "सवाल हैं?",
      "ask_farmbot": "FarmBot से पूछें।",
      "bot_name": "FarmBot AI",
      "bot_status": "ऑनलाइन और मदद के लिए तैयार",
      "bot_message": "मैं आपको हमारी AI ग्रेडिंग, भुगतान चक्र और बाज़ार नीतियों को तुरंत समझने में मदद कर सकता हूँ!",
      "still_questions": "अभी भी सवाल हैं?",
      "contact_support": "सहायता से संपर्क करें",
      "q1": "AI गुणवत्ता ग्रेडिंग कैसे काम करती है?",
      "a1": "हमारा AI 98.5% सटीकता के साथ ग्रेड (A+, A, B, C) प्रदान करने के लिए फसल छवियों का विश्लेषण करता है।",
      "q2": "क्या FarmGuard का उपयोग करना मुफ्त है?",
      "a2": "हाँ! पंजीकरण मुफ्त है। हम सफल लेनदेन पर केवल 2-3% कमीशन लेते हैं।",
      "q3": "मुझे भुगतान कैसे मिलेगा?",
      "a3": "भुगतान हमारे सुरक्षित AgriPay सिस्टम के माध्यम से 24-48 घंटों के भीतर संसाधित किए जाते हैं।",
      "q4": "कौन सी फसलें समर्थित हैं?",
      "a4": "हम सब्जियों, फलों, अनाज और दालों सहित 50+ फसलों का समर्थन करते हैं।"
    },
    "footer": {
      "stay_updated": "अपडेट रहें",
      "newsletter_desc": "सुविधाओं, बाज़ार के रुझानों और सफलता की कहानियों पर नवीनतम अपडेट प्राप्त करें।",
      "subscribe": "सब्सक्राइब करें",
      "placeholder": "अपना ईमेल दर्ज करें",
      "platform": "प्लेटफ़ॉर्म",
      "company": "कंपनी",
      "support": "सहायता",
      "legal": "कानूनी",
      "rights": "सर्वाधिकार सुरक्षित।"
    }
};

const mrLanding = {
    "get_started": "सुरू करा",
    "intelligent_sourcing": "इंटेलिजेंट सोर्सिंग",
    "trade_network": "ट्रेड नेटवर्क",
    "market_intel": "बाजार इंटेलिजन्स",
    "contact": "संपर्क साधा",
    "ai_demo": {
      "badge": "AI तंत्रज्ञान",
      "title": "AI गुणवत्ता शोध",
      "subtitle": "कृतीमध्ये पहा",
      "step1": "पीक प्रतिमा अपलोड करा",
      "analyzing": "AI विश्लेषण करत आहे...",
      "step2": "झटपट AI निकाल",
      "quality_grade": "गुणवत्ता ग्रेड",
      "premium_quality": "प्रीमियम गुणवत्ता",
      "confidence": "आत्मविश्वास",
      "no_defects": "कोणतेही दोष आढळले नाहीत",
      "recommended_price": "शिफारस केलेली किंमत",
      "per_kg": "/किलो"
    },
    "animated_hero": {
      "words": ["विक्री", "स्मार्ट.", "खरेदी", "उत्तम."],
      "badge": "AI-शक्तीवर चालणारे एगटेक प्लॅटफॉर्म",
      "subtext": "शेतकऱ्यांना थेट खरेदीदारांशी जोडणारी AI-शक्तीवर चालणारी बाजारपेठ. मध्यस्थ नाही. रास्त भाव. रिअल-टाइम लॉजिस्टिक.",
      "cta1": "विनामूल्य सुरू करा",
      "cta2": "डेमो पहा",
      "s1": "शेतकरी",
      "s2": "जिल्हे",
      "s3": "गुणवत्ता स्कोअर",
      "s4": "व्यापार मूल्य"
    },
    "hero": {
      "title_part1": "आत्मविश्वासाने वाढा.",
      "title_part2": "विश्वासाने ",
      "title_trust": "व्यापार करा.",
      "subtitle": "ODOP उत्पादनांसाठी जागतिक दर्जाचे पोर्टल. आधुनिक कृषी परिसंस्थेसाठी थेट सोर्सिंग, AI-आधारित गुणवत्ता आश्वासन आणि रिअल-टाइम पुरवठा साखळी इंटेलिजन्स.",
      "farmer_cta": "शेतकऱ्यांसाठी",
      "buyer_cta": "खरेदीदारांसाठी",
      "farmers_empowered": "शेतकरी सशक्त",
      "monthly_gmv": "मासिक GMV",
      "quality_accuracy": "गुणवत्ता अचूकता",
      "ai_powered_farming": "AI-शक्तीवर चालणारे शेतकरी हब",
      "ai_powered_farming_desc": "रिअल-टाइम ग्रेड विश्लेषण आणि उत्पन्न अंदाज",
      "estimated_yield": "अंदाजित उत्पन्न",
      "ai_quality_grade": "AI गुणवत्ता ग्रेड",
      "odop_certified": "ODOP प्रमाणित",
      "verified_portal": "सत्यापित पोर्टल"
    },
    "problem": {
      "title": "कृषी आव्हान",
      "subtitle": "शेतकऱ्यांना खरेदीदारांशी थेट संपर्क साधण्यासाठी धडपड करावी लागते. मध्यस्थ ३०-४०% कमिशन घेतात. खरेदीदारांना गुणवत्तेच्या अनिश्चिततेचा सामना करावा लागतो.",
      "middlemen_title": "मध्यस्थांकडून शोषण",
      "middlemen_desc": "मध्यस्थांमुळे शेतकरी ३०-४०% नफा गमावतात",
      "quality_title": "गुणवत्ता अनिश्चितता",
      "quality_desc": "खरेदीदारांकडे उत्पादनाची वास्तविकता सत्यापित करण्याचा कोणताही मार्ग नाही",
      "opacity_title": "पुरवठा साखळी अस्पष्टता",
      "opacity_desc": "शेतापासून बाजारापर्यंत कोणतीही पारदर्शकता नाही",
      "logistics_title": "अकार्यक्षम लॉजिस्टिक",
      "logistics_desc": "उत्पादाने आणि लॉजिस्टिक दरम्यान कोणतेही इंटेलिजेंट मॅचिंग नाही",
      "stat_commission": "मध्यस्थांककडे गमावलेले कमिशन",
      "stat_unsure": "खरेदीदार गुणवत्तेबद्दल अनिश्चित",
      "stat_loss": "सरासरी शेतकरी वार्षिक तोटा"
    },
    "solution": {
      "title": "आमचा उपाय",
      "subtitle": "ODOP कनेक्ट मध्यस्थांना काढून टाकते, गुणवत्ता सुनिश्चित करते आणि पारदर्शकता आणते",
      "direct_title": "थेट कनेक्शन",
      "direct_desc": "शेतकरी थेट खरेदीदारांशी जोडले जातात, मध्यस्थांना काढून टाकतात आणि नफा वाढवतात",
      "direct_highlight": "↑ ३०-४०% जास्त नफा",
      "quality_title": "गुणवत्ता सत्यापित",
      "quality_desc": "AI इमेज रेकग्निशनचा वापर करून ९८.५% अचूकतेसह उत्पादनाच्या गुणवत्तेचे विश्लेषण करते",
      "quality_highlight": "९८.५% गुणवत्ता अचूकता",
      "transparency_title": "पूर्ण पारदर्शकता",
      "transparency_desc": "ब्लॉकचेन शेतापासून खरेदीदारापर्यंत पुरवठा साखळीचा मागोवा घेते",
      "transparency_highlight": "अपरिवर्तनीय रेकॉर्ड",
      "verified": "सत्यापित",
      "blockchain": "ब्लॉकचेन",
      "this_month": "इस महिन्यात",
      "orders": "ऑर्डर",
      "grade": "ग्रेड",
      "quick_actions": "त्वरीत कृती",
      "ai_grade_btn": "AI ग्रेड",
      "chat_btn": "चॅट",
      "fresh_tomatoes": "ताजे टोमॅटो",
      "kg_available": "किलो उपलब्ध",
      "mockup": {
        "farmer_name": "राजेश कुमार",
        "farmer_role": "टोमॅटो शेतकरी"
      }
    },
    "process": {
      "badge": "सोपी प्रक्रिया",
      "title": "हे कसे कार्य करते",
      "subtitle": "४ सोप्या टप्प्यात विक्री सुरू करा",
      "step1_title": "साइन अप करा",
      "step1_desc": "२ मिनिटांत खाते तयार करा",
      "step2_title": "उत्पादने सूचीबद्ध करा",
      "step2_desc": "AI ग्रेडिंगसह पिके जोडा",
      "step3_title": "कनेक्ट व्हा",
      "step3_desc": "खरेदीदारांशी त्वरित जुळा",
      "step4_title": "पेमेंट मिळवा",
      "step4_desc": "सुरक्षित ब्लॉकचेन पेमेंट"
    },
    "testimonials": {
      "badge": "यशोगाथा",
      "title": "शेतकरी आमच्यावर प्रेम करतात",
      "income_increase": "उत्पन्नात वाढ",
      "quality_grade": "गुणवत्ता ग्रेड",
      "monthly_gmv": "मासिक GMV",
      "quote1": "AI गुणवत्ता ग्रेडिंग och थेट खरेदीदार कनेक्शनमुळे माझे उत्पन्न ४५% ने वाढले आहे!",
      "quote2": "AI गुणवत्ता शोध आश्चर्यकारक आहे! मला सतत A+ ग्रेड मिळतात.",
      "quote3": "रिअल-टाइम बाजार किमती मला अधिक चांगली योजना बनवण्यास मदत करतात. ब्लॉकचेन ट्रॅकिंग विश्वास निर्माण करते."
    },
    "features": {
       "badge": "शक्तिशाली वैशिष्ट्ये",
      "title": "तुम्हाला हवे ते सर्व",
      "subtitle": "आधुनिक कृषी व्यापारासाठी तयार केलेले",
      "f1_title": "AI गुणवत्ता ग्रेडिंग",
      "f1_desc": "झटपट पीक विश्लेषण",
      "f2_title": "रिअल-टाइम चॅट",
      "f2_desc": "त्वरित कनेक्ट व्हा",
      "f3_title": "ब्लॉकचेन सत्यापित",
      "f3_desc": "पारदर्शक ट्रॅकिंग",
      "f4_title": "स्मार्ट लॉजिस्टिक",
      "f4_desc": "अनुकूलित वितरण",
      "f5_title": "मागणी अंदाज",
      "f5_desc": "बाजार कल भाकीत",
      "f6_title": "सुरक्षित पेमेंट",
      "f6_desc": "सुरक्षित व्यवहार",
      "f7_title": "एनालिटिक्स",
      "f7_desc": "डेटा-आधारित अंतर्दृष्टी",
      "f8_title": "बहुभाषी",
      "f8_desc": "तुमची भाषा बोला",
      "f9_title": "थेट बाजार",
      "f9_desc": "मध्यस्थ नाही"
    },
    "benefits": {
      "badge": "शक्तिशाली फायदे",
      "title": "सर्वांसाठी फायदे",
      "subtitle": "अत्याधुनिक तंत्रज्ञानासह शेतकरी आणि खरेदीदार दोघांनाही सक्षम करणे",
      "for_farmers": "शेतकऱ्यांसाठी",
      "maximize_profits": "तुमचा नफा वाढवा",
      "for_buyers": "खरेदीदारांसाठी",
      "quality_guaranteed": "गुणवत्तेची खात्री",
      "farmer": {
        "income": "४०% जास्त उत्पन्न",
        "ai_grading": "झटपट AI ग्रेडिंग",
        "pricing": "रिअल-टाइम किंमत",
        "payments": "सुरक्षित पेमेंट",
        "logistics": "स्मार्ट लॉजिस्टिक",
        "analytics": "एनालिटिक्स डॅशबोर्ड"
      },
      "buyer": {
        "verified": "सत्यापित गुणवत्ता",
        "direct": "शेताकडून थेट",
        "flexible": "लव्हचिक पेमेंट",
        "bulk": "बल्क ऑर्डर",
        "traceability": "पूर्ण शोधण्यायोग्यता",
        "fast": "जलद वितरण"
      }
    },
    "cta": {
      "badge": "४,५०,०००+ शेतकऱ्यांशी जोडा",
      "title": "तुम्हा कृषी व्यवसाय बदलण्यासाठी तयार आहात का?",
      "subtitle": "त्या हजारो शेतकऱ्यांशी आणि खरेदीदारांशी जोडा जे आधीच चांगल्या नफ्याचा अनुभव घेत आहेत.",
      "start_farmer": "शेतकरी म्हणून सुरू करा",
      "start_buyer": "खरेदीदार म्हणून सुरू करा",
      "free_to_join": "विनामूल्य सामील व्हा",
      "no_cc": "क्रेडिट कार्डची आवश्यकता नाही",
      "setup_5m": "५ मिनिटांत सेटअप"
    },
    "faq": {
      "badge": "डिजिटल सहाय्यक",
      "title": "काही प्रश्न आहेत का?",
      "ask_farmbot": "FarmBot ला विचारा.",
      "bot_name": "FarmBot AI",
      "bot_status": "ऑनलाइन आणि मदतीसाठी तयार",
      "bot_message": "मी तुम्हाला आमची AI ग्रेडिंग, पेमेंट सायकल आणि बाजार धोरणे त्वरित समजून घेण्याची मदत करू शकतो!",
      "still_questions": "अद्याप प्रश्न आहेत का?",
      "contact_support": "सपोर्टशी संपर्क साधा",
      "q1": "AI गुणवत्ता ग्रेडिंग कसे कार्य करते?",
      "a1": "आमची AI ९८.५% अचूकतेसह ग्रेड (A+, A, B, C) नियुक्त करण्यासाठी पीक प्रतिमांचे विश्लेषण करते.",
      "q2": "FarmGuard वापरण्यासाठी विनामूल्य आहे का?",
      "a2": "हो! नोंदणी विनामूल्य आहे. आम्ही यशस्वी व्यवहारांवर केवळ २-३% कमिशन घेतो.",
      "q3": "एकूण पेमेंट कसे मिळेल?",
      "a3": "आमच्या सुरक्षित AgriPay सिस्टमद्वारे २४-४८ तासांच्या आत पेमेंटवर प्रक्रिया केली जाते.",
      "q4": "कोणती पिके समर्थित आहेत?",
      "a4": "आम्ही भाज्या, फळे, धान्ये आणि कडधान्ये यासह ५०+ पिकांना समर्थन देतो."
    },
    "footer": {
      "stay_updated": "अपडेट रहा",
      "newsletter_desc": "वैशिष्ट्ये, बाजार कल आणि यशोगाथांबद्दल नवीनतम अपडेट मिळवा.",
      "subscribe": "सबस्क्राइब करा",
      "placeholder": "तुमचा ईमेल प्रविष्ट करा",
      "platform": "प्लॅटफॉर्म",
      "company": "कंपनी",
      "support": "सपोर्ट",
      "legal": "कायदेशीर",
      "rights": "सर्व हक्क राखीव."
    }
};

updateFile('en', enLanding, commonEN, authEN, uiEN);
updateFile('hi', hiLanding, commonHI, authHI, uiHI);
updateFile('mr', mrLanding, commonMR, authMR, uiMR);
