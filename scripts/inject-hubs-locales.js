const fs = require('fs');
const path = require('path');

const locales = ['en', 'hi', 'mr'];
const baseDir = path.join(__dirname, '../apps/web/public/locales');
const srcDir = path.join(__dirname, '../apps/web/src/i18n/locales');

const hubKeys = {
  en: {
    "cropHub": {
      "title": "Crop Management Hub.",
      "allInOne": "ALL-IN-ONE",
      "subtitle": "Complete crop inventory, quality & insights",
      "refresh": "Refresh",
      "refreshing": "Refreshing...",
      "tabs": {
        "overview": "Agri Hub Overview",
        "inventory": "Smart Inventory",
        "quality": "Quality Scanner",
        "insights": "Farm Insights",
        "autoSell": "Auto-Sell Rules"
      },
      "stats": {
        "totalCrops": "Total Crops",
        "activeCrops": "Active Crops",
        "totalQuantity": "Total Quantity",
        "totalValue": "Total Value",
        "avgQuality": "Avg Quality",
        "readyToHarvest": "Ready to Harvest"
      },
      "categories": {
        "title": "Crops by Category",
        "vegetables": "Vegetables",
        "grains": "Grains",
        "fruits": "Fruits",
        "pulses": "Pulses",
        "crops": "crops"
      },
      "topCrops": {
        "title": "Top Performing Crops"
      },
      "quality": {
        "title": "Quality Distribution",
        "grade": "Grade"
      },
      "activity": {
        "title": "Recent Activities"
      },
      "actions": {
        "title": "Quick Actions",
        "addCrop": "Add New Crop",
        "qualityScan": "Quality Scan",
        "viewInsights": "View Insights",
        "autoSellSetup": "Auto-Sell Setup"
      }
    },
    "orderHub": {
      "title": "Order Control Center",
      "subtitle": "Manage all incoming orders and logistics"
    }
  },
  hi: {
    "cropHub": {
      "title": "फसल प्रबंधन केंद्र।",
      "allInOne": "ऑल-इन-वन",
      "subtitle": "संपूर्ण फसल सूची, गुणवत्ता और जानकारी",
      "refresh": "रिफ्रेश करें",
      "refreshing": "रिफ्रेश हो रहा है...",
      "tabs": {
        "overview": "एग्री हब अवलोकन",
        "inventory": "स्मार्ट इन्वेंटरी",
        "quality": "गुणवत्ता स्कैनर",
        "insights": "खेत की जानकारी",
        "autoSell": "ऑटो-सेल नियम"
      },
      "stats": {
        "totalCrops": "कुल फसलें",
        "activeCrops": "सक्रिय फसलें",
        "totalQuantity": "कुल मात्रा",
        "totalValue": "कुल मूल्य",
        "avgQuality": "औसत गुणवत्ता",
        "readyToHarvest": "कटाई के लिए तैयार"
      },
      "categories": {
        "title": "श्रेणी के अनुसार फसलें",
        "vegetables": "सब्जियां",
        "grains": "अनाज",
        "fruits": "फल",
        "pulses": "दालें",
        "crops": "फसलें"
      },
      "topCrops": {
        "title": "शीर्ष प्रदर्शन करने वाली फसलें"
      },
      "quality": {
        "title": "गुणवत्ता वितरण",
        "grade": "ग्रेड"
      },
      "activity": {
        "title": "हाल की गतिविधियां"
      },
      "actions": {
        "title": "त्वरित कार्रवाइयां",
        "addCrop": "नई फसल जोड़ें",
        "qualityScan": "गुणवत्ता स्कैन",
        "viewInsights": "जानकारी देखें",
        "autoSellSetup": "ऑटो-सेल सेटअप"
      }
    },
    "orderHub": {
      "title": "ऑर्डर नियंत्रण केंद्र",
      "subtitle": "सभी आने वाले ऑर्डर और रसद प्रबंधित करें"
    }
  },
  mr: {
    "cropHub": {
      "title": "पीक व्यवस्थापन केंद्र.",
      "allInOne": "ऑल-इन-वन",
      "subtitle": "संपूर्ण पीक यादी, गुणवत्ता आणि माहिती",
      "refresh": "रिफ्रेश करा",
      "refreshing": "रिफ्रेश होत आहे...",
      "tabs": {
        "overview": "अॅग्री हब आढावा",
        "inventory": "स्मार्ट इन्व्हेंटरी",
        "quality": "गुणवत्ता स्कॅनर",
        "insights": "शेतीची माहिती",
        "autoSell": "ऑटो-सेल नियम"
      },
      "stats": {
        "totalCrops": "एकूण पिके",
        "activeCrops": "सक्रिय पिके",
        "totalQuantity": "एकूण प्रमाण",
        "totalValue": "एकूण मूल्य",
        "avgQuality": "सरासरी गुणवत्ता",
        "readyToHarvest": "कापणीसाठी तयार"
      },
      "categories": {
        "title": "प्रकारानुसार पिके",
        "vegetables": "भाज्या",
        "grains": "धान्य",
        "fruits": "फळे",
        "pulses": "डाळी",
        "crops": "पिके"
      },
      "topCrops": {
        "title": "उत्कृष्ट कामगिरी करणारी पिके"
      },
      "quality": {
        "title": "गुणवत्ता वितरण",
        "grade": "ग्रेड"
      },
      "activity": {
        "title": "अलीकडील घडामोडी"
      },
      "actions": {
        "title": "त्वरित कृती",
        "addCrop": "नवीन पीक जोडा",
        "qualityScan": "गुणवत्ता स्कॅन",
        "viewInsights": "माहिती पहा",
        "autoSellSetup": "ऑटो-सेल सेटअप"
      }
    },
    "orderHub": {
      "title": "ऑर्डर नियंत्रण केंद्र",
      "subtitle": "सर्व येणार्‍या ऑर्डर आणि लॉजिस्टिक व्यवस्थापित करा"
    }
  }
};

locales.forEach(lang => {
  // Update public/locales
  const publicPath = path.join(baseDir, lang, 'translation.json');
  if (fs.existsSync(publicPath)) {
    const data = JSON.parse(fs.readFileSync(publicPath, 'utf8'));
    const merged = { ...data, ...hubKeys[lang] };
    fs.writeFileSync(publicPath, JSON.stringify(merged, null, 2), 'utf8');
  }

  // Update src/i18n/locales
  const srcPathGlob = path.join(srcDir, `${lang}.json`);
  if (fs.existsSync(srcPathGlob)) {
    const data = JSON.parse(fs.readFileSync(srcPathGlob, 'utf8'));
    const merged = { ...data, ...hubKeys[lang] };
    fs.writeFileSync(srcPathGlob, JSON.stringify(merged, null, 2), 'utf8');
  }
});
console.log('Hub translations injected.');
