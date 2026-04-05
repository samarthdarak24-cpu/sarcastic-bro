import json, os

base = os.path.dirname(os.path.abspath(__file__))

new_keys = {
    "en": {
        "register": {
            "title": "Create account",
            "subtitle": "Join the future of agricultural trade",
            "farmer_label": "Farmer",
            "farmer_desc": "List products & use AI grading",
            "buyer_label": "Buyer",
            "buyer_desc": "Source directly & track orders",
            "continue": "Continue",
            "full_name": "Full Name",
            "email": "Email Address",
            "password": "Password",
            "password_hint": "Min 8 characters, 1 uppercase letter, 1 number",
            "creating": "Creating account...",
            "complete": "Complete Registration",
            "go_back": "Go back to type selection",
            "secure": "Secure Registration",
            "have_account": "Already have an account?",
            "log_in": "Log in",
            "password_min": "Password must be at least 8 characters",
            "password_upper": "Password must contain at least one uppercase letter",
            "password_number": "Password must contain at least one number",
            "success": "Account created successfully!"
        },
        "login": {
            "title": "Welcome back",
            "subtitle": "Log in to your agriculture ecosystem",
            "email": "Email Address",
            "password": "Password",
            "forgot": "Forgot?",
            "sign_in": "Sign in to account",
            "authenticating": "Authenticating...",
            "or_continue": "Or continue with",
            "social": "Social",
            "otp": "OTP",
            "no_account": "Don't have an account yet?",
            "register_free": "Register for Free"
        },
        "buyer_dashboard": {
            "welcome": "Welcome back, {{name}}! 👋",
            "overview": "Your global procurement command center.",
            "executing": "Executing your {{section}} protocol.",
            "market_sync": "Market Synchronization",
            "total_sourcing": "Total Sourcing",
            "active_bids": "Active Bids",
            "verified_suppliers": "Verified Suppliers",
            "value_saved": "Value Saved",
            "high_activity": "High Activity",
            "new_suppliers": "+5 new",
            "target_met": "Target Met",
            "neural_radar": "Neural Market Radar",
            "liquidity_scan": "Subcontinental Liquidity Scan · Active",
            "confidence": "92% CONFIDENCE",
            "alpha_clusters": "Alpha Clusters",
            "price_delta": "Price Delta",
            "vibe_score": "Vibe Score",
            "optimal": "Optimal",
            "tactical_actions": "Tactical Actions",
            "source_suppliers": "Source Suppliers",
            "bulk_procurement": "Bulk Procurement",
            "ai_negotiator": "AI Negotiator",
            "feed": "Feed",
            "new_order": "New Order",
            "supplier_vetted": "Supplier Vetted",
            "in_transit": "In Transit",
            "alpha_procure": "Alpha Procure Active",
            "alpha_desc": "Your sourcing patterns are 22% more efficient than the regional average. We've identified 4 new clusters that match your profile.",
            "analyze_clusters": "ANALYZE CLUSTERS",
            "initializing": "Initializing Node..."
        },
        "logistics": {
            "title": "Logistics Manager",
            "active_shipments": "Active Shipments",
            "in_transit": "In Transit",
            "delivered": "Delivered",
            "pending_pickup": "Pending Pickup",
            "track_shipment": "Track Shipment",
            "route_map": "Route Map",
            "temperature": "Temperature",
            "humidity": "Humidity",
            "estimated_delivery": "Estimated Delivery",
            "carrier": "Carrier",
            "tracking_id": "Tracking ID",
            "from": "From",
            "to": "To",
            "shipment_details": "Shipment Details",
            "cold_chain": "Cold Chain Active"
        },
        "escrow": {
            "title": "Escrow Payments",
            "held": "Held in Escrow",
            "released": "Released",
            "disputed": "Disputed",
            "refunded": "Refunded",
            "deposit_tx": "Deposit Transaction",
            "release_tx": "Release Transaction",
            "buyer_confirmed": "Buyer Confirmed",
            "farmer_delivered": "Farmer Delivered",
            "smart_contract": "Smart Contract Address",
            "secure_payment": "Secure Payment Protocol"
        },
        "auto_sell": {
            "title": "Auto-Sell Rules",
            "create_rule": "Create Rule",
            "min_price": "Minimum Price",
            "quantity": "Quantity to Auto-Sell",
            "active_rules": "Active Rules",
            "paused_rules": "Paused Rules",
            "triggers": "Price Triggers",
            "executed": "Executed Trades",
            "rule_active": "Rule Active",
            "rule_paused": "Rule Paused"
        },
        "behavioral": {
            "title": "Behavioral Insights",
            "user_activity": "User Activity Pattern",
            "peak_hours": "Peak Trading Hours",
            "favorite_categories": "Favorite Categories",
            "search_patterns": "Search Patterns",
            "engagement_score": "Engagement Score",
            "recommendations": "AI Recommendations"
        },
        "price_protection": {
            "title": "Price Protection Hub",
            "active_policies": "Active Policies",
            "total_coverage": "Total Coverage",
            "claims_filed": "Claims Filed",
            "premium_paid": "Premium Paid",
            "create_policy": "Create Policy",
            "insured_price": "Insured Price",
            "policy_period": "Policy Period",
            "claim_status": "Claim Status"
        },
        "global_trade": {
            "title": "Global Export Audit",
            "compliance_score": "Compliance Score",
            "export_ready": "Export Ready Products",
            "certifications": "Active Certifications",
            "audit_trail": "Audit Trail",
            "export_markets": "Target Export Markets",
            "documentation": "Required Documentation"
        },
        "crop_advisor": {
            "title": "Crop Advisor",
            "soil_health": "Soil Health Index",
            "weather_forecast": "Weather Forecast",
            "pest_alert": "Pest Alert",
            "recommended_crops": "Recommended Crops",
            "planting_calendar": "Planting Calendar",
            "yield_prediction": "Yield Prediction",
            "irrigation_advice": "Irrigation Advice"
        },
        "negotiation": {
            "title": "Negotiation Hub",
            "active_negotiations": "Active Negotiations",
            "counter_offer": "Counter Offer",
            "accept": "Accept Offer",
            "reject": "Reject Offer",
            "best_price": "Best Price",
            "your_offer": "Your Offer",
            "rounds": "Negotiation Rounds",
            "deal_value": "Deal Value"
        },
        "sourcing": {
            "title": "Sourcing Space",
            "explore_products": "Explore Products",
            "filter_by_region": "Filter by Region",
            "quality_verified": "Quality Verified",
            "direct_from_farm": "Direct from Farm",
            "bulk_available": "Bulk Available",
            "send_inquiry": "Send Inquiry",
            "compare_prices": "Compare Prices"
        },
        "supplier": {
            "title": "Supplier Insights",
            "reliability_score": "Reliability Score",
            "delivery_rate": "On-time Delivery Rate",
            "quality_rating": "Quality Rating",
            "total_transactions": "Total Transactions",
            "response_time": "Avg Response Time",
            "verified_badge": "Verified Supplier",
            "view_profile": "View Full Profile"
        },
        "trust_reviews": {
            "title": "Trust & Reviews",
            "overall_rating": "Overall Rating",
            "total_reviews": "Total Reviews",
            "verified_reviews": "Verified Reviews",
            "write_review": "Write a Review",
            "rating_breakdown": "Rating Breakdown",
            "recent_reviews": "Recent Reviews",
            "helpful": "Helpful",
            "report": "Report"
        },
        "price_intel": {
            "title": "Price Intelligence",
            "market_trends": "Market Trends",
            "price_forecast": "Price Forecast",
            "regional_comparison": "Regional Comparison",
            "demand_supply": "Demand-Supply Analysis",
            "price_alerts": "Price Alerts",
            "historical_data": "Historical Data",
            "best_buy_time": "Best Buy Time"
        },
        "order_tracker": {
            "title": "Order Tracker",
            "order_placed": "Order Placed",
            "processing": "Processing",
            "shipped": "Shipped",
            "out_for_delivery": "Out for Delivery",
            "delivered": "Delivered",
            "estimated_time": "Estimated Time",
            "live_tracking": "Live Tracking"
        },
        "bulk_trade": {
            "title": "Bulk Trade Desk",
            "create_rfq": "Create RFQ",
            "minimum_quantity": "Minimum Quantity",
            "delivery_schedule": "Delivery Schedule",
            "payment_terms": "Payment Terms",
            "bids_received": "Bids Received",
            "compare_bids": "Compare Bids",
            "award_contract": "Award Contract"
        },
        "cluster_map": {
            "title": "Regional Cluster Intelligence",
            "production_clusters": "Production Clusters",
            "active_regions": "Active Regions",
            "crop_density": "Crop Density",
            "supply_nodes": "Supply Nodes",
            "transport_routes": "Transport Routes",
            "seasonal_data": "Seasonal Data"
        },
        "pre_booking": {
            "title": "Pre-Booking Hub",
            "upcoming_harvest": "Upcoming Harvest",
            "book_now": "Book Now",
            "advance_payment": "Advance Payment",
            "delivery_date": "Expected Delivery",
            "locked_price": "Locked Price",
            "booking_confirmed": "Booking Confirmed"
        },
        "page": {
            "home_title": "Direct Farm-to-Market Trading Platform",
            "home_subtitle": "Connect directly with buyers, get fair prices powered by AI, and track your orders in real-time. No middlemen, just results.",
            "trusted_by": "Trusted by 450,000+ Farmers",
            "start_trading": "Start Trading Now",
            "watch_demo": "Watch Demo",
            "reviews_count": "4.9/5 from 12,000+ reviews",
            "farmers": "Farmers",
            "districts": "Districts",
            "quality": "Quality",
            "see_how": "See How Farmers Are",
            "transforming": "Transforming Their Business",
            "watch_stories": "Watch real stories from farmers across India who increased their income by 40% using our platform.",
            "direct_access": "Direct access to 10,000+ verified buyers",
            "ai_price": "AI-powered price recommendations",
            "realtime_logistics": "Real-time logistics tracking",
            "secure_payment": "Secure payment guarantee",
            "everything_need": "Everything You Need to Succeed",
            "powerful_tools": "Powerful tools designed for modern agricultural trading",
            "ai_price_intelligence": "AI Price Intelligence",
            "ai_price_intel_desc": "Get real-time market insights and fair price recommendations based on demand-supply analytics.",
            "quality_verification": "Quality Verification",
            "quality_verify_desc": "AI-powered crop quality detection with blockchain traceability for every product.",
            "smart_logistics": "Smart Logistics",
            "smart_logistics_desc": "Track shipments in real-time with optimized routes and delivery predictions.",
            "direct_marketplace": "Direct Marketplace",
            "direct_market_desc": "Connect with 10,000+ verified buyers without any middlemen or commission.",
            "advanced_features": "Advanced Features for Modern Agriculture",
            "cutting_edge": "Cutting-edge technology to maximize your profits",
            "trusted_across": "Trusted by Farmers Across India",
            "real_stories": "Real stories from real farmers",
            "start_3_steps": "Start Trading in 3 Simple Steps",
            "create_account": "Create Account",
            "create_account_desc": "Quick registration with KYC verification in 2 minutes",
            "list_browse": "List or Browse",
            "list_browse_desc": "Farmers list produce, buyers discover quality products",
            "trade_track": "Trade & Track",
            "trade_track_desc": "Complete transactions with real-time tracking",
            "ready_transform": "Ready to Transform Your Agricultural Business?",
            "join_count": "Join 450,000+ farmers and buyers building transparent, profitable supply chains.",
            "start_free": "Start Free Today",
            "schedule_demo": "Schedule Demo",
            "income_increase": "income increase",
            "copyright": "© 2026 FarmGuard Technologies. All rights reserved.",
            "english_india": "English (India)"
        }
    },
    "hi": {
        "register": {
            "title": "खाता बनाएं",
            "subtitle": "कृषि व्यापार के भविष्य से जुड़ें",
            "farmer_label": "किसान",
            "farmer_desc": "उत्पाद सूचीबद्ध करें और AI ग्रेडिंग का उपयोग करें",
            "buyer_label": "खरीदार",
            "buyer_desc": "सीधे स्रोत करें और ऑर्डर ट्रैक करें",
            "continue": "जारी रखें",
            "full_name": "पूरा नाम",
            "email": "ईमेल पता",
            "password": "पासवर्ड",
            "password_hint": "न्यूनतम 8 अक्षर, 1 बड़ा अक्षर, 1 संख्या",
            "creating": "खाता बन रहा है...",
            "complete": "पंजीकरण पूर्ण करें",
            "go_back": "प्रकार चयन पर वापस जाएं",
            "secure": "सुरक्षित पंजीकरण",
            "have_account": "पहले से खाता है?",
            "log_in": "लॉग इन करें",
            "password_min": "पासवर्ड कम से कम 8 अक्षरों का होना चाहिए",
            "password_upper": "पासवर्ड में कम से कम एक बड़ा अक्षर होना चाहिए",
            "password_number": "पासवर्ड में कम से कम एक संख्या होनी चाहिए",
            "success": "खाता सफलतापूर्वक बनाया गया!"
        },
        "login": {
            "title": "वापस स्वागत है",
            "subtitle": "अपने कृषि पारिस्थितिकी तंत्र में लॉग इन करें",
            "email": "ईमेल पता",
            "password": "पासवर्ड",
            "forgot": "भूल गए?",
            "sign_in": "खाते में साइन इन करें",
            "authenticating": "प्रमाणित हो रहा है...",
            "or_continue": "या इसके साथ जारी रखें",
            "social": "सोशल",
            "otp": "OTP",
            "no_account": "अभी तक खाता नहीं है?",
            "register_free": "मुफ्त में पंजीकरण करें"
        },
        "buyer_dashboard": {
            "welcome": "वापस स्वागत है, {{name}}! 👋",
            "overview": "आपका वैश्विक खरीद कमांड सेंटर।",
            "executing": "आपके {{section}} प्रोटोकॉल को क्रियान्वित कर रहे हैं।",
            "market_sync": "बाज़ार सिंक्रोनाइज़ेशन",
            "total_sourcing": "कुल सोर्सिंग",
            "active_bids": "सक्रिय बोलियां",
            "verified_suppliers": "सत्यापित आपूर्तिकर्ता",
            "value_saved": "बचत मूल्य",
            "high_activity": "उच्च गतिविधि",
            "new_suppliers": "+5 नए",
            "target_met": "लक्ष्य पूरा",
            "neural_radar": "न्यूरल मार्केट रडार",
            "liquidity_scan": "उपमहाद्वीपीय तरलता स्कैन · सक्रिय",
            "confidence": "92% विश्वास",
            "alpha_clusters": "अल्फा क्लस्टर",
            "price_delta": "मूल्य डेल्टा",
            "vibe_score": "वाइब स्कोर",
            "optimal": "इष्टतम",
            "tactical_actions": "सामरिक कार्रवाई",
            "source_suppliers": "आपूर्तिकर्ता खोजें",
            "bulk_procurement": "थोक खरीद",
            "ai_negotiator": "AI वार्ताकार",
            "feed": "फीड",
            "new_order": "नया ऑर्डर",
            "supplier_vetted": "आपूर्तिकर्ता सत्यापित",
            "in_transit": "रास्ते में",
            "alpha_procure": "अल्फा प्रोक्योर सक्रिय",
            "alpha_desc": "आपके सोर्सिंग पैटर्न क्षेत्रीय औसत से 22% अधिक कुशल हैं। हमने आपकी प्रोफाइल से मेल खाने वाले 4 नए क्लस्टर पहचाने हैं।",
            "analyze_clusters": "क्लस्टर विश्लेषण करें",
            "initializing": "नोड प्रारंभ हो रहा है..."
        },
        "logistics": {
            "title": "लॉजिस्टिक्स प्रबंधक",
            "active_shipments": "सक्रिय शिपमेंट",
            "in_transit": "रास्ते में",
            "delivered": "डिलीवर हुआ",
            "pending_pickup": "पिकअप लंबित",
            "track_shipment": "शिपमेंट ट्रैक करें",
            "temperature": "तापमान",
            "humidity": "आर्द्रता",
            "estimated_delivery": "अनुमानित डिलीवरी",
            "carrier": "वाहक",
            "tracking_id": "ट्रैकिंग आईडी",
            "cold_chain": "कोल्ड चेन सक्रिय"
        },
        "escrow": {
            "title": "एस्क्रो भुगतान",
            "held": "एस्क्रो में रखा",
            "released": "जारी किया",
            "disputed": "विवादित",
            "refunded": "वापस किया",
            "secure_payment": "सुरक्षित भुगतान प्रोटोकॉल"
        },
        "auto_sell": {
            "title": "ऑटो-सेल नियम",
            "create_rule": "नियम बनाएं",
            "min_price": "न्यूनतम मूल्य",
            "active_rules": "सक्रिय नियम",
            "paused_rules": "रुके हुए नियम"
        },
        "behavioral": {
            "title": "व्यवहार संबंधी इनसाइट्स",
            "user_activity": "उपयोगकर्ता गतिविधि पैटर्न",
            "peak_hours": "पीक ट्रेडिंग के घंटे",
            "engagement_score": "जुड़ाव स्कोर",
            "recommendations": "AI सिफारिशें"
        },
        "price_protection": {
            "title": "मूल्य सुरक्षा हब",
            "active_policies": "सक्रिय पॉलिसी",
            "total_coverage": "कुल कवरेज",
            "claims_filed": "दावे दर्ज",
            "create_policy": "पॉलिसी बनाएं"
        },
        "global_trade": {
            "title": "वैश्विक निर्यात ऑडिट",
            "compliance_score": "अनुपालन स्कोर",
            "export_ready": "निर्यात तैयार उत्पाद",
            "certifications": "सक्रिय प्रमाणपत्र"
        },
        "crop_advisor": {
            "title": "फसल सलाहकार",
            "soil_health": "मिट्टी स्वास्थ्य सूचकांक",
            "weather_forecast": "मौसम पूर्वानुमान",
            "pest_alert": "कीट अलर्ट",
            "recommended_crops": "अनुशंसित फसलें",
            "yield_prediction": "उपज भविष्यवाणी"
        },
        "negotiation": {
            "title": "नेगोशिएशन हब",
            "active_negotiations": "सक्रिय वार्ताएं",
            "counter_offer": "प्रति प्रस्ताव",
            "accept": "प्रस्ताव स्वीकारें",
            "reject": "प्रस्ताव अस्वीकार करें",
            "deal_value": "सौदे का मूल्य"
        },
        "sourcing": {
            "title": "सोर्सिंग स्पेस",
            "explore_products": "उत्पाद एक्सप्लोर करें",
            "quality_verified": "गुणवत्ता सत्यापित",
            "direct_from_farm": "सीधे खेत से",
            "send_inquiry": "पूछताछ भेजें",
            "compare_prices": "कीमतों की तुलना करें"
        },
        "supplier": {
            "title": "आपूर्तिकर्ता इनसाइट्स",
            "reliability_score": "विश्वसनीयता स्कोर",
            "delivery_rate": "समय पर डिलीवरी दर",
            "quality_rating": "गुणवत्ता रेटिंग",
            "verified_badge": "सत्यापित आपूर्तिकर्ता"
        },
        "trust_reviews": {
            "title": "ट्रस्ट और समीक्षाएं",
            "overall_rating": "समग्र रेटिंग",
            "total_reviews": "कुल समीक्षाएं",
            "write_review": "समीक्षा लिखें",
            "recent_reviews": "हाल की समीक्षाएं"
        },
        "price_intel": {
            "title": "मूल्य इंटेलिजेंस",
            "market_trends": "बाज़ार रुझान",
            "price_forecast": "मूल्य पूर्वानुमान",
            "price_alerts": "मूल्य अलर्ट",
            "best_buy_time": "खरीदने का सबसे अच्छा समय"
        },
        "order_tracker": {
            "title": "ऑर्डर ट्रैकर",
            "order_placed": "ऑर्डर दिया गया",
            "processing": "प्रक्रिया में",
            "shipped": "भेजा गया",
            "delivered": "डिलीवर हुआ",
            "live_tracking": "लाइव ट्रैकिंग"
        },
        "bulk_trade": {
            "title": "बल्क ट्रेड डेस्क",
            "create_rfq": "RFQ बनाएं",
            "bids_received": "प्राप्त बोलियां",
            "award_contract": "अनुबंध प्रदान करें"
        },
        "cluster_map": {
            "title": "क्षेत्रीय क्लस्टर इंटेलिजेंस",
            "production_clusters": "उत्पादन क्लस्टर",
            "active_regions": "सक्रिय क्षेत्र"
        },
        "pre_booking": {
            "title": "प्री-बुकिंग हब",
            "upcoming_harvest": "आगामी फसल",
            "book_now": "अभी बुक करें",
            "locked_price": "लॉक की गई कीमत",
            "booking_confirmed": "बुकिंग पुष्टि"
        },
        "page": {
            "home_title": "सीधा किसान-से-बाज़ार ट्रेडिंग प्लेटफॉर्म",
            "home_subtitle": "सीधे खरीदारों से जुड़ें, AI-संचालित उचित कीमतें पाएं, और रियल-टाइम में अपने ऑर्डर ट्रैक करें। कोई बिचौलिया नहीं, सिर्फ परिणाम।",
            "trusted_by": "450,000+ किसानों द्वारा विश्वसनीय",
            "start_trading": "अभी ट्रेडिंग शुरू करें",
            "watch_demo": "डेमो देखें",
            "reviews_count": "12,000+ समीक्षाओं से 4.9/5",
            "farmers": "किसान",
            "districts": "जिले",
            "quality": "गुणवत्ता",
            "everything_need": "सफल होने के लिए सब कुछ",
            "powerful_tools": "आधुनिक कृषि व्यापार के लिए शक्तिशाली उपकरण",
            "ai_price_intelligence": "AI मूल्य इंटेलिजेंस",
            "quality_verification": "गुणवत्ता सत्यापन",
            "smart_logistics": "स्मार्ट लॉजिस्टिक्स",
            "direct_marketplace": "सीधा बाज़ार",
            "trusted_across": "भारत भर के किसानों द्वारा विश्वसनीय",
            "real_stories": "असली किसानों की असली कहानियां",
            "start_3_steps": "3 सरल चरणों में ट्रेडिंग शुरू करें",
            "create_account": "खाता बनाएं",
            "list_browse": "सूची या ब्राउज़ करें",
            "trade_track": "व्यापार और ट्रैक करें",
            "ready_transform": "अपने कृषि व्यवसाय को बदलने के लिए तैयार हैं?",
            "join_count": "550,000+ किसानों और खरीदारों से जुड़ें जो पारदर्शी, लाभदायक आपूर्ति श्रृंखलाएं बना रहे हैं।",
            "start_free": "आज मुफ्त शुरू करें",
            "schedule_demo": "डेमो शेड्यूल करें",
            "income_increase": "आय वृद्धि",
            "copyright": "© 2026 फार्मगार्ड टेक्नोलॉजीज। सर्वाधिकार सुरक्षित।",
            "english_india": "हिंदी (भारत)"
        }
    },
    "mr": {
        "register": {
            "title": "खाते तयार करा",
            "subtitle": "कृषी व्यापाराच्या भविष्यात सामील व्हा",
            "farmer_label": "शेतकरी",
            "farmer_desc": "उत्पादने सूचीबद्ध करा आणि AI ग्रेडिंग वापरा",
            "buyer_label": "खरेदीदार",
            "buyer_desc": "थेट स्रोत करा आणि ऑर्डर ट्रॅक करा",
            "continue": "पुढे जा",
            "full_name": "पूर्ण नाव",
            "email": "ईमेल पत्ता",
            "password": "पासवर्ड",
            "password_hint": "किमान 8 अक्षरे, 1 मोठे अक्षर, 1 अंक",
            "creating": "खाते तयार होत आहे...",
            "complete": "नोंदणी पूर्ण करा",
            "go_back": "प्रकार निवडीवर परत जा",
            "secure": "सुरक्षित नोंदणी",
            "have_account": "आधीच खाते आहे?",
            "log_in": "लॉग इन करा",
            "password_min": "पासवर्ड किमान 8 अक्षरांचा असावा",
            "password_upper": "पासवर्डमध्ये किमान एक मोठे अक्षर असावे",
            "password_number": "पासवर्डमध्ये किमान एक अंक असावा",
            "success": "खाते यशस्वीरित्या तयार झाले!"
        },
        "login": {
            "title": "परत स्वागत आहे",
            "subtitle": "तुमच्या कृषी इकोसिस्टमला लॉग इन करा",
            "email": "ईमेल पत्ता",
            "password": "पासवर्ड",
            "forgot": "विसरलात?",
            "sign_in": "खात्यात साइन इन करा",
            "authenticating": "प्रमाणीकरण होत आहे...",
            "or_continue": "किंवा यासह सुरू ठेवा",
            "social": "सोशल",
            "otp": "OTP",
            "no_account": "अजून खाते नाही?",
            "register_free": "मोफत नोंदणी करा"
        },
        "buyer_dashboard": {
            "welcome": "परत स्वागत आहे, {{name}}! 👋",
            "overview": "तुमचा जागतिक खरेदी कमांड सेंटर.",
            "executing": "तुमचा {{section}} प्रोटोकॉल कार्यान्वित करत आहोत.",
            "market_sync": "बाजार सिंक्रोनायझेशन",
            "total_sourcing": "एकूण सोर्सिंग",
            "active_bids": "सक्रिय बिड्स",
            "verified_suppliers": "सत्यापित पुरवठादार",
            "value_saved": "बचत मूल्य",
            "high_activity": "उच्च क्रियाकलाप",
            "new_suppliers": "+5 नवीन",
            "target_met": "लक्ष्य पूर्ण",
            "neural_radar": "न्यूरल मार्केट रडार",
            "liquidity_scan": "उपखंडीय तरलता स्कॅन · सक्रिय",
            "confidence": "92% विश्वास",
            "alpha_clusters": "अल्फा क्लस्टर",
            "price_delta": "किंमत डेल्टा",
            "vibe_score": "वाइब स्कोर",
            "optimal": "इष्टतम",
            "tactical_actions": "सामरिक क्रिया",
            "source_suppliers": "पुरवठादार शोधा",
            "bulk_procurement": "मोठ्या प्रमाणात खरेदी",
            "ai_negotiator": "AI वाटाघाटकर्ता",
            "feed": "फीड",
            "new_order": "नवीन ऑर्डर",
            "supplier_vetted": "पुरवठादार तपासला",
            "in_transit": "वाटेवर",
            "alpha_procure": "अल्फा प्रोक्योर सक्रिय",
            "alpha_desc": "तुमचे सोर्सिंग पॅटर्न प्रादेशिक सरासरीपेक्षा 22% अधिक कार्यक्षम आहेत. आम्ही तुमच्या प्रोफाइलशी जुळणारे 4 नवीन क्लस्टर ओळखले आहेत.",
            "analyze_clusters": "क्लस्टर विश्लेषण करा",
            "initializing": "नोड प्रारंभ होत आहे..."
        },
        "logistics": {
            "title": "लॉजिस्टिक्स व्यवस्थापक",
            "active_shipments": "सक्रिय शिपमेंट",
            "in_transit": "वाटेवर",
            "delivered": "वितरित",
            "pending_pickup": "पिकअप प्रलंबित",
            "track_shipment": "शिपमेंट ट्रॅक करा",
            "temperature": "तापमान",
            "humidity": "आर्द्रता",
            "estimated_delivery": "अंदाजित वितरण",
            "carrier": "वाहक",
            "cold_chain": "कोल्ड चेन सक्रिय"
        },
        "escrow": {
            "title": "एस्क्रो पेमेंट",
            "held": "एस्क्रोमध्ये ठेवले",
            "released": "सोडले",
            "disputed": "वादग्रस्त",
            "refunded": "परत केले",
            "secure_payment": "सुरक्षित पेमेंट प्रोटोकॉल"
        },
        "auto_sell": {
            "title": "ऑटो-सेल नियम",
            "create_rule": "नियम तयार करा",
            "min_price": "किमान किंमत",
            "active_rules": "सक्रिय नियम",
            "paused_rules": "थांबवलेले नियम"
        },
        "behavioral": {
            "title": "वर्तणुकीशी संबंधित इनसाइट्स",
            "user_activity": "वापरकर्ता क्रियाकलाप पॅटर्न",
            "peak_hours": "पीक ट्रेडिंग तास",
            "engagement_score": "सहभाग गुण",
            "recommendations": "AI शिफारसी"
        },
        "price_protection": {
            "title": "किंमत संरक्षण हब",
            "active_policies": "सक्रिय पॉलिसी",
            "total_coverage": "एकूण कव्हरेज",
            "claims_filed": "दावे दाखल",
            "create_policy": "पॉलिसी तयार करा"
        },
        "global_trade": {
            "title": "जागतिक निर्यात ऑडिट",
            "compliance_score": "अनुपालन गुण",
            "export_ready": "निर्यात तयार उत्पादने",
            "certifications": "सक्रिय प्रमाणपत्रे"
        },
        "crop_advisor": {
            "title": "पीक सल्लागार",
            "soil_health": "मातीचे आरोग्य निर्देशांक",
            "weather_forecast": "हवामान अंदाज",
            "pest_alert": "कीड सतर्कता",
            "recommended_crops": "शिफारस केलेली पिके",
            "yield_prediction": "उत्पादन अंदाज"
        },
        "negotiation": {
            "title": "नेगोशिएशन हब",
            "active_negotiations": "सक्रिय वाटाघाटी",
            "counter_offer": "प्रति प्रस्ताव",
            "accept": "प्रस्ताव स्वीकारा",
            "reject": "प्रस्ताव नाकारा",
            "deal_value": "सौद्याचे मूल्य"
        },
        "sourcing": {
            "title": "सोर्सिंग स्पेस",
            "explore_products": "उत्पादने एक्सप्लोर करा",
            "quality_verified": "गुणवत्ता सत्यापित",
            "direct_from_farm": "थेट शेतातून",
            "send_inquiry": "चौकशी पाठवा",
            "compare_prices": "किमतींची तुलना करा"
        },
        "supplier": {
            "title": "पुरवठादार इनसाइट्स",
            "reliability_score": "विश्वासार्हता गुण",
            "delivery_rate": "वेळेवर वितरण दर",
            "quality_rating": "गुणवत्ता रेटिंग",
            "verified_badge": "सत्यापित पुरवठादार"
        },
        "trust_reviews": {
            "title": "ट्रस्ट आणि रिव्ह्यू",
            "overall_rating": "एकूण रेटिंग",
            "total_reviews": "एकूण रिव्ह्यू",
            "write_review": "रिव्ह्यू लिहा",
            "recent_reviews": "अलीकडील रिव्ह्यू"
        },
        "price_intel": {
            "title": "किंमत इंटेलिजन्स",
            "market_trends": "बाजार ट्रेंड",
            "price_forecast": "किंमत अंदाज",
            "price_alerts": "किंमत सतर्कता",
            "best_buy_time": "खरेदीसाठी सर्वोत्तम वेळ"
        },
        "order_tracker": {
            "title": "ऑर्डर ट्रॅकर",
            "order_placed": "ऑर्डर दिला",
            "processing": "प्रक्रियेत",
            "shipped": "पाठवले",
            "delivered": "वितरित",
            "live_tracking": "लाइव्ह ट्रॅकिंग"
        },
        "bulk_trade": {
            "title": "बल्क ट्रेड डेस्क",
            "create_rfq": "RFQ तयार करा",
            "bids_received": "प्राप्त बिड्स",
            "award_contract": "करार प्रदान करा"
        },
        "cluster_map": {
            "title": "प्रादेशिक क्लस्टर इंटेलिजन्स",
            "production_clusters": "उत्पादन क्लस्टर",
            "active_regions": "सक्रिय प्रदेश"
        },
        "pre_booking": {
            "title": "प्री-बुकिंग हब",
            "upcoming_harvest": "आगामी कापणी",
            "book_now": "आता बुक करा",
            "locked_price": "लॉक केलेली किंमत",
            "booking_confirmed": "बुकिंग पुष्टी"
        },
        "page": {
            "home_title": "थेट शेती-ते-बाजार ट्रेडिंग प्लॅटफॉर्म",
            "home_subtitle": "थेट खरेदीदारांशी जोडा, AI-चालित योग्य किमती मिळवा, आणि रिअल-टाइममध्ये तुमचे ऑर्डर ट्रॅक करा. कोणताही दलाल नाही, फक्त परिणाम.",
            "trusted_by": "450,000+ शेतकऱ्यांचा विश्वास",
            "start_trading": "आता ट्रेडिंग सुरू करा",
            "watch_demo": "डेमो पहा",
            "reviews_count": "12,000+ रिव्ह्यूमधून 4.9/5",
            "farmers": "शेतकरी",
            "districts": "जिल्हे",
            "quality": "गुणवत्ता",
            "everything_need": "यशस्वी होण्यासाठी सर्व काही",
            "powerful_tools": "आधुनिक कृषी व्यापारासाठी शक्तिशाली साधने",
            "ai_price_intelligence": "AI किंमत इंटेलिजन्स",
            "quality_verification": "गुणवत्ता पडताळणी",
            "smart_logistics": "स्मार्ट लॉजिस्टिक्स",
            "direct_marketplace": "थेट बाजारपेठ",
            "trusted_across": "भारतभरातील शेतकऱ्यांचा विश्वास",
            "real_stories": "खऱ्या शेतकऱ्यांच्या खऱ्या कहाण्या",
            "start_3_steps": "3 सोप्या टप्प्यांत ट्रेडिंग सुरू करा",
            "create_account": "खाते तयार करा",
            "list_browse": "यादी किंवा ब्राउझ करा",
            "trade_track": "व्यापार आणि ट्रॅक करा",
            "ready_transform": "तुमचा कृषी व्यवसाय बदलण्यास तयार आहात?",
            "join_count": "550,000+ शेतकरी आणि खरेदीदारांसह सामील व्हा जे पारदर्शक, फायदेशीर पुरवठा साखळ्या तयार करत आहेत.",
            "start_free": "आज मोफत सुरू करा",
            "schedule_demo": "डेमो शेड्यूल करा",
            "income_increase": "उत्पन्न वाढ",
            "copyright": "© 2026 फार्मगार्ड टेक्नॉलॉजीज. सर्व हक्क राखीव.",
            "english_india": "मराठी (भारत)"
        }
    }
}

for lang in ["en", "hi", "mr"]:
    fp = os.path.join(base, "public", "locales", lang, "translation.json")
    with open(fp, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    for ns, keys in new_keys[lang].items():
        if ns not in data:
            data[ns] = {}
        for k, v in keys.items():
            data[ns][k] = v
    
    with open(fp, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Updated {lang}/translation.json — total keys: {sum(len(v) for v in data.values())}")

print("\n🎉 All translation files updated!")
