import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_BASE_URL } from './api/config';
import { useAuth } from './context/AuthContext';

const translations = {
  en: {
    title: "Disease Detection",
    desc: "Instant diagnosis powered by advanced AI. Upload a photo of your crop's leaf to get an immediate health assessment.",
    uploadTitle: "Capture or Upload Photo",
    uploadDesc: "Focus on a single, well-lit leaf for the most accurate AI diagnosis.",
    uploadBtn: "Select From Gallery",
    uploadLimit: "Supports JPEG, PNG up to 10MB",
    analyzing: "Analyzing Symptoms...",
    running: "Running neural network diagnosis",
    change: "Change",
    startScan: "Start Scan",
    severity: "Severity",
    confidence: "Confidence",
    analyzedJustNow: "Analyzed just now",
    symptomsDetected: "Symptoms Detected",
    expertActionPlan: "Expert Action Plan",
    organicMethod: "Organic Method",
    chemicalMethod: "Chemical Method",
    downloadReport: "Download Full PDF Report",
    recentScans: "Recent Scans",
    diagnosticHistory: "Your diagnostic history and trends",
    viewFullHistory: "View Full History",
    photoGuide: "Photography Guide",
    step1Title: "Single Leaf Focus",
    step1Desc: "Isolate one affected leaf. Avoid scanning the entire plant or multiple leaves at once.",
    step2Title: "Indirect Sunlight",
    step2Desc: "Best results are achieved in bright, natural, indirect light. Avoid harsh shadows or camera flash.",
    step3Title: "High Contrast",
    step3Desc: "Ensure the leaf is clearly visible against a neutral background (like your palm or the ground).",
    needExpert: "Need human expert review?",
    expertDesc: "Our regional agronomists are online to provide secondary verification of your scan results.",
    connectExpert: "Connect with Expert",
    noHistory: "No scan history found. Start your first scan today.",
    
    // Disease names and content translations
    'Late Blight': 'Late Blight',
    'Early Blight': 'Early Blight',
    'Leaf Mold': 'Leaf Mold',
    'Healthy Leaf': 'Healthy Leaf',
    'Critical': 'Critical',
    'Moderate': 'Moderate',
    'Low': 'Low',
    
    // Symptoms
    'Dark water-soaked spots on leaves': 'Dark water-soaked spots on leaves',
    'White fuzzy growth on underside': 'White fuzzy growth on underside',
    'Rapid leaf browning': 'Rapid leaf browning',
    'Target-like concentric rings': 'Target-like concentric rings',
    'Yellowing around spots': 'Yellowing around spots',
    'Lower leaf drop': 'Lower leaf drop',
    'Pale green spots on upper leaf': 'Pale green spots on upper leaf',
    'Olive-green velvet growth underneath': 'Olive-green velvet growth underneath',
    'Normal green pigmentation': 'Normal green pigmentation',
    'Robust cell structure': 'Robust cell structure',
    'No visible pathogens': 'No visible pathogens',
    
    // Treatments
    'Apply Copper-based fungicides': 'Apply Copper-based fungicides',
    'Remove infected plants immediately': 'Remove infected plants immediately',
    'Chlorothalonil spray': 'Chlorothalonil spray',
    'Mancozeb application': 'Mancozeb application',
    'Prune lower branches': 'Prune lower branches',
    'Improve air circulation': 'Improve air circulation',
    'Azoxystrobin': 'Azoxystrobin',
    'Daconil': 'Daconil',
    'Reduce humidity': 'Reduce humidity',
    'Increase plant spacing': 'Increase plant spacing',
    'Sulfur dust': 'Sulfur dust',
    'Chlorothalonil': 'Chlorothalonil',
    'Continue standard watering': 'Continue standard watering',
    'Maintain soil nutrition': 'Maintain soil nutrition',
    'No chemical intervention needed': 'No chemical intervention needed'
  },
  hi: {
    title: "रोग पहचान",
    desc: "उन्नत एआई द्वारा संचालित त्वरित निदान। तत्काल स्वास्थ्य मूल्यांकन प्राप्त करने के लिए अपनी फसल की पत्ती का फोटो अपलोड करें।",
    uploadTitle: "फोटो लें या अपलोड करें",
    uploadDesc: "सबसे सटीक एआई निदान के लिए एक ही, अच्छी रोशनी वाली पत्ती पर ध्यान केंद्रित करें।",
    uploadBtn: "गैलरी से चुनें",
    uploadLimit: "JPEG, PNG का समर्थन करता है (10MB तक)",
    analyzing: "लक्षणों का विश्लेषण किया जा रहा है...",
    running: "न्यूरल नेटवर्क निदान चल रहा है",
    change: "बदलें",
    startScan: "स्कैन शुरू करें",
    severity: "गंभीरता",
    confidence: "विश्वास स्तर",
    analyzedJustNow: "अभी विश्लेषण किया गया",
    symptomsDetected: "पाए गए लक्षण",
    expertActionPlan: "विशेषज्ञ कार्य योजना",
    organicMethod: "जैविक विधि",
    chemicalMethod: "रासायनिक विधि",
    downloadReport: "पूरी पीडीएफ रिपोर्ट डाउनलोड करें",
    recentScans: "हाल के स्कैन",
    diagnosticHistory: "आपका नैदानिक ​​इतिहास और रुझान",
    viewFullHistory: "पूरा इतिहास देखें",
    photoGuide: "फोटोग्राफी गाइड",
    step1Title: "एकल पत्ती फोकस",
    step1Desc: "एक प्रभावित पत्ती को अलग करें। एक साथ पूरे पौधे या कई पत्तियों को स्कैन करने से बचें।",
    step2Title: "परोक्ष सूर्य का प्रकाश",
    step2Desc: "सर्वोत्तम परिणाम चमकीले, प्राकृतिक, परोक्ष प्रकाश में प्राप्त होते हैं। तेज परछाइयों या कैमरे के फ्लैश से बचें।",
    step3Title: "उच्च कंट्रास्ट",
    step3Desc: "सुनिश्चित करें कि पत्ती एक तटस्थ पृष्ठभूमि (जैसे आपकी हथेली या जमीन) के खिलाफ स्पष्ट रूप से दिखाई दे रही है।",
    needExpert: "मानव विशेषज्ञ समीक्षा की आवश्यकता है?",
    expertDesc: "हमारे क्षेत्रीय कृषि वैज्ञानिक आपके स्कैन परिणामों के द्वितीयक सत्यापन प्रदान करने के लिए ऑनलाइन हैं।",
    connectExpert: "विशेषज्ञ से जुड़ें",
    noHistory: "कोई स्कैन इतिहास नहीं मिला। आज ही अपना पहला स्कैन शुरू करें।",
    
    // Disease names and content translations
    'Late Blight': 'पछेती झुलसा (Late Blight)',
    'Early Blight': 'अगेती झुलसा (Early Blight)',
    'Leaf Mold': 'लीफ मोल्ड (Leaf Mold)',
    'Healthy Leaf': 'स्वस्थ पत्ती (Healthy Leaf)',
    'Critical': 'गंभीर',
    'Moderate': 'मध्यम',
    'Low': 'कम',
    
    // Symptoms
    'Dark water-soaked spots on leaves': 'पत्तियों पर काले पानी से लथपथ धब्बे',
    'White fuzzy growth on underside': 'निचली सतह पर सफेद रोएंदार वृद्धि',
    'Rapid leaf browning': 'पत्तियों का तेजी से भूरा होना',
    'Target-like concentric rings': 'लक्ष्य जैसे संकेंद्रित छल्ले',
    'Yellowing around spots': 'धब्बों के आसपास पीलापन',
    'Lower leaf drop': 'निचली पत्तियों का गिरना',
    'Pale green spots on upper leaf': 'ऊपरी पत्ती पर हल्के हरे धब्बे',
    'Olive-green velvet growth underneath': 'नीचे जैतून-हरे मखमली विकास',
    'Normal green pigmentation': 'सामान्य हरा रंजकता',
    'Robust cell structure': 'मजबूत सेल संरचना',
    'No visible pathogens': 'कोई दृश्य रोगजनक नहीं',
    
    // Treatments
    'Apply Copper-based fungicides': 'तांबे आधारित कवकनाशी का प्रयोग करें',
    'Remove infected plants immediately': 'संक्रमित पौधों को तुरंत हटा दें',
    'Chlorothalonil spray': 'क्लोरोथालोनिल स्प्रे',
    'Mancozeb application': 'मानकोजेब का छिड़काव',
    'Prune lower branches': 'निचली शाखाओं की छँटाई करें',
    'Improve air circulation': 'हवा का संचलन बेहतर करें',
    'Azoxystrobin': 'एज़ोक्सीस्ट्रोबिन',
    'Daconil': 'डेकोनिल',
    'Reduce humidity': 'नमी कम करें',
    'Increase plant spacing': 'पौधों के बीच की दूरी बढ़ाएँ',
    'Sulfur dust': 'सल्फर डस्टिंग',
    'Chlorothalonil': 'क्लोरोथालोनिल',
    'Continue standard watering': 'सामान्य सिंचाई जारी रखें',
    'Maintain soil nutrition': 'मिट्टी का पोषण बनाए रखें',
    'No chemical intervention needed': 'किसी रासायनिक हस्तक्षेप की आवश्यकता नहीं है'
  },
  te: {
    title: "తెగులు గుర్తింపు",
    desc: "అధునాతన AI ద్వారా తక్షణ నిర్ధారణ. తక్షణ ఆరోగ్య అంచనాను పొందడానికి మీ పంట ఆకు ఫోటోను అప్‌లోడ్ చేయండి.",
    uploadTitle: "ఫోటో తీయండి లేదా అప్‌లోడ్ చేయండి",
    uploadDesc: "అత్యంత ఖచ్చితమైన AI నిర్ధారణ కోసం ఒకే, వెలుతురు ఉన్న ఆకుపై దృష్టి పెట్టండి.",
    uploadBtn: "గ్యాలరీ నుండి ఎంచుకోండి",
    uploadLimit: "JPEG, PNG ఫార్మాట్లలో 10MB వరకు సపోర్ట్ చేస్తుంది",
    analyzing: "లక్షణాలను విశ్లేషిస్తోంది...",
    running: "న్యూరల్ నెట్‌వర్క్ నిర్ధారణ నడుోంది",
    change: "మార్చండి",
    startScan: "స్కాన్ ప్రారంభించు",
    severity: "తీవ్రత",
    confidence: "ఖచ్చితత్వం",
    analyzedJustNow: "ఇప్పుడే విశ్లేషించబడింది",
    symptomsDetected: "గుర్తించిన లక్షణాలు",
    expertActionPlan: "నిపుణుల కార్యాచరణ ప్రణాళిక",
    organicMethod: "సేంద్రీయ పద్ధతి",
    chemicalMethod: "రసాయన పద్ధతి",
    downloadReport: "పూర్తి PDF నివేదికను డౌన్‌లోడ్ చేయండి",
    recentScans: "ఇటీవలి స్కాన్‌లు",
    diagnosticHistory: "మీ వ్యాధి నిర్ధారణ చరిత్ర మరియు పోకడలు",
    viewFullHistory: "పూర్తి చరిత్రను చూడండి",
    photoGuide: "ఫోటోగ్రఫీ గైడ్",
    step1Title: "ఒకే ఆకుపై దృష్టి",
    step1Desc: "ప్రభావితమైన ఒక ఆకును వేరు చేయండి. మొత్తం మొక్కను లేదా బహుళ ఆకులను ఒకేసారి స్కాన్ చేయవద్దు.",
    step2Title: "పరోక్ష సూర్యకాంతి",
    step2Desc: "ప్రకాశవంతమైన, సహజమైన, పరోక్ష కాంతిలో ఉత్తమ ఫలితాలు వస్తాయి. తీవ్రమైన నీడలు లేదా కెమెరా ఫ్లాష్‌ను నివారించండి.",
    step3Title: "అధిక కాంట్రాస్ట్",
    step3Desc: "ఆకు స్పష్టమైన నేపధ్యంలో (మీ అరచేయి లేదా నేల వంటివి) స్పష్టంగా కనిపించేలా చూసుకోండి.",
    needExpert: "వ్యక్తిగత నిపుణుల సమీక్ష కావాలా?",
    expertDesc: "మీ స్కాన్ ఫలితాల ద్వితీయ ధృవీకరణను అందించడానికి మా ప్రాంతీయ వ్యవసాయ నిపుణులు ఆన్‌లైన్‌లో ఉన్నారు.",
    connectExpert: "నిపుణుడితో కనెక్ట్ అవ్వండి",
    noHistory: "స్కాన్ చరిత్ర కనుగొనబడలేదు. ఈ రోజు మీ మొదటి స్కాన్ ప్రారంభించండి.",
    
    // Disease names and content translations
    'Late Blight': 'లేట్ బ్లైట్ తెగులు (Late Blight)',
    'Early Blight': 'అర్లీ బ్లైట్ తెగులు (Early Blight)',
    'Leaf Mold': 'ఆకు బూజు తెగులు (Leaf Mold)',
    'Healthy Leaf': 'ఆరోగ్యకరమైన ఆకు (Healthy Leaf)',
    'Critical': 'తీవ్రమైనది',
    'Moderate': 'మధ్యస్థం',
    'Low': 'తక్కువ',
    
    // Symptoms
    'Dark water-soaked spots on leaves': 'ఆకులపై ముదురు రంగు నీటి మచ్చలు',
    'White fuzzy growth on underside': 'ఆకు వెనుక భాగంలో తెల్లటి బూజు లాంటి పెరుగుదల',
    'Rapid leaf browning': 'ఆకులు వేగంగా గోధుమ రంగులోకి మారడం',
    'Target-like concentric rings': 'గుండ్రటి వలయాలు వంటి మచ్చలు',
    'Yellowing around spots': 'మచ్చల చుట్టూ పసుపు రంగులోకి మారడం',
    'Lower leaf drop': 'క్రింది ఆకులు రాలిపోవడం',
    'Pale green spots on upper leaf': 'ఆకు పైభాగంలో లేత ఆకుపచ్చ మచ్చలు',
    'Olive-green velvet growth underneath': 'ఆకు క్రింద ఆలివ్-ఆకుపచ్చ మఖ్మల్ లాంటి పెరుగుదల',
    'Normal green pigmentation': 'సాధారణ ఆకుపచ్చ రంగు',
    'Robust cell structure': 'బలమైన కణ నిర్మాణం',
    'No visible pathogens': 'కంటికి కనిపించే తెగుళ్లు లేవు',
    
    // Treatments
    'Apply Copper-based fungicides': 'రాగి ఆధారిత శిలీంద్రనాశకాలను వాడండి',
    'Remove infected plants immediately': 'సోకిన మొక్కలను వెంటనే తొలగించండి',
    'Chlorothalonil spray': 'క్లోరోథలోనిల్ స్ప్రే',
    'Mancozeb application': 'మాంకోజెబ్ అప్లికేషన్',
    'Prune lower branches': 'క్రింది కొమ్మలను కత్తిరించండి',
    'Improve air circulation': 'గాలి ప్రసరణను మెరుగుపరచండి',
    'Azoxystrobin': 'అజోక్సిస్ట్రోబిన్',
    'Daconil': 'డాకోనిల్',
    'Reduce humidity': 'తేమను తగ్గించండి',
    'Increase plant spacing': 'మొక్కల మధ్య దూరం పెంచండి',
    'Sulfur dust': 'గంధకపు పొడి చల్లడం',
    'Chlorothalonil': 'క్లోరోథలోనిల్',
    'Continue standard watering': 'సాధారణ నీటి పారుదల కొనసాగించండి',
    'Maintain soil nutrition': 'నేల పోషకాలను నిర్వహించండి',
    'No chemical intervention needed': 'రసాయన జోక్యం అవసరం లేదు'
  }
};

const DiseaseDetection = ({ onModuleSwitch }) => {
  const { user } = useAuth();
  const [currentLang, setCurrentLang] = useState('en');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/disease/history`);
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  const t = (text) => {
    return translations[currentLang]?.[text] || text;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current.click();
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);
    try {
      const res = await axios.post(`${API_BASE_URL}/disease/detect`);
      setResult(res.data);
      fetchHistory();
    } catch (err) {
      setError("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetDetection = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="bg-cream text-ink font-sans min-h-screen overflow-x-hidden">
      {/* TopAppBar Shell (Mobile Only) */}
      <header className="md:hidden w-full h-16 sticky top-0 z-50 bg-cream/80 backdrop-blur-md flex justify-between items-center px-6 border-b border-moss/10">
        <span className="text-2xl font-serif font-bold text-forest">AgriGuide</span>
        <div className="flex gap-4 pr-28 items-center">
          <div className="relative">
            <button 
              onClick={() => setIsLangOpen(!isLangOpen)} 
              className="material-symbols-outlined text-forest cursor-pointer hover:opacity-85 flex items-center justify-center"
            >
              language
            </button>
            <AnimatePresence>
              {isLangOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-full mt-2 w-36 bg-white border border-moss/10 rounded-2xl shadow-xl z-50 overflow-hidden"
                >
                  <button
                    onClick={() => { setCurrentLang('en'); setIsLangOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-all hover:bg-foam flex items-center justify-between cursor-pointer ${currentLang === 'en' ? 'text-forest bg-foam' : 'text-stone'}`}
                  >
                    <span>English</span>
                    {currentLang === 'en' && <span className="material-symbols-outlined text-sage text-sm">check</span>}
                  </button>
                  <button
                    onClick={() => { setCurrentLang('hi'); setIsLangOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-all hover:bg-foam flex items-center justify-between cursor-pointer ${currentLang === 'hi' ? 'text-forest bg-foam' : 'text-stone'}`}
                  >
                    <span>हिन्दी</span>
                    {currentLang === 'hi' && <span className="material-symbols-outlined text-sage text-sm">check</span>}
                  </button>
                  <button
                    onClick={() => { setCurrentLang('te'); setIsLangOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-all hover:bg-foam flex items-center justify-between cursor-pointer ${currentLang === 'te' ? 'text-forest bg-foam' : 'text-stone'}`}
                  >
                    <span>తెలుగు</span>
                    {currentLang === 'te' && <span className="material-symbols-outlined text-sage text-sm">check</span>}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <span className="material-symbols-outlined text-forest">notifications</span>
        </div>
      </header>

      {/* SideNavBar Anchor */}
      <aside className="hidden md:flex h-screen w-72 fixed left-0 top-0 bg-night flex-col py-8 px-4 gap-2 z-40 border-r border-sage/15">
        <div className="mb-10 px-4">
          <h1 className="text-xl font-serif text-white font-bold">Agri<span className="text-gold italic">Guide</span></h1>
          <p className="text-[10px] text-white/30 font-medium tracking-widest uppercase">The Digital Agronomist</p>
        </div>

        <nav className="flex flex-col gap-2 flex-grow">
          <a onClick={() => onModuleSwitch?.('weather')} className="text-white/50 px-4 py-3 hover:bg-white/5 rounded-xl transition-all duration-200 flex items-center gap-3 font-medium text-sm cursor-pointer">
            <span className="material-symbols-outlined" data-icon="cloud">cloud</span>
            Weather Updates
          </a>
          <a className="bg-sage/15 text-mint border-l-2 border-mint px-4 py-3 flex items-center gap-3 font-medium text-sm cursor-pointer">
            <span className="material-symbols-outlined" data-icon="psychology">psychology</span>
            Disease Detection
          </a>
          <a onClick={() => onModuleSwitch?.('soil')} className="text-white/50 px-4 py-3 hover:bg-white/5 rounded-xl transition-all duration-200 flex items-center gap-3 font-medium text-sm cursor-pointer" >
            <span className="material-symbols-outlined" data-icon="science">science</span>
            Soil Advisory
          </a>
          <a onClick={() => onModuleSwitch?.('market')} className="text-white/50 px-4 py-3 hover:bg-white/5 rounded-xl transition-all duration-200 flex items-center gap-3 font-medium text-sm cursor-pointer">
            <span className="material-symbols-outlined" data-icon="trending_up">trending_up</span>
            Market Intelligence
          </a>
          <a onClick={() => onModuleSwitch?.('community')} className="text-white/50 px-4 py-3 hover:bg-white/5 rounded-xl transition-all duration-200 flex items-center gap-3 font-medium text-sm cursor-pointer">
            <span className="material-symbols-outlined" data-icon="forum">forum</span>
            Community
          </a>
        </nav>

        <div className="mt-auto flex flex-col gap-2 border-t border-white/5 pt-6">
          <div className="flex items-center gap-3 px-4 py-4 mt-2">
            <img className="w-10 h-10 rounded-full object-cover border border-white/10" alt="Farmer Portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7hIbptporCZhDJWo_5R64q-Mdz_xd00E6wF_bi-3fb7phofEXbsPlMAs61Dl7JFmOe4pwQaPvEOKn4uCH1MmFs_FJhHMc3oRS-2Cpoi87jrv_tHWTsm38nOsXo_Y0gzp17w028HKT8dIa4qne_aZ6vbq4pzGkoaMuoGauY9SuOsBPfGEskLn4f98LWGxQfk26cwhB7rbqbJ-FOjOAR_vCQs_wkxJSKkLAgY0obFUEPaVtRhVhcWJzHoZ4sP0xdWXt5TLODMBXvMvR" />
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{user?.name || 'Farmer User'}</p>
              <p className="text-xs text-white/40 truncate tracking-wide uppercase font-mono">Premium Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="md:ml-72 min-h-screen p-6 md:p-12 pb-24 md:pb-12">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-forest mb-2">{t('title')}</h2>
            <p className="text-stone max-w-lg leading-relaxed text-lg">{t('desc')}</p>
          </motion.div>
          
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-2 bg-foam px-4 py-2 rounded-full border border-moss/10 shadow-sm mr-40 hover:bg-mist transition-all cursor-pointer font-sans"
            >
              <span className="material-symbols-outlined text-sage text-lg">language</span>
              <span className="text-sm font-bold text-forest uppercase tracking-tighter">
                {currentLang === 'en' ? 'हिन्दी • ENGLISH • తెలుగు' : currentLang === 'hi' ? 'हिन्दी' : 'తెలుగు'}
              </span>
              <span className="material-symbols-outlined text-stone text-sm transition-transform duration-200" style={{ transform: isLangOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                expand_more
              </span>
            </button>
            
            <AnimatePresence>
              {isLangOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-40 top-full mt-2 w-40 bg-white border border-moss/10 rounded-2xl shadow-xl z-50 overflow-hidden"
                >
                  <button
                    onClick={() => { setCurrentLang('en'); setIsLangOpen(false); }}
                    className={`w-full text-left px-4 py-3 text-sm font-bold transition-all hover:bg-foam flex items-center justify-between cursor-pointer ${currentLang === 'en' ? 'text-forest bg-foam' : 'text-stone'}`}
                  >
                    <span>English</span>
                    {currentLang === 'en' && <span className="material-symbols-outlined text-sage text-sm">check</span>}
                  </button>
                  <button
                    onClick={() => { setCurrentLang('hi'); setIsLangOpen(false); }}
                    className={`w-full text-left px-4 py-3 text-sm font-bold transition-all hover:bg-foam flex items-center justify-between cursor-pointer ${currentLang === 'hi' ? 'text-forest bg-foam' : 'text-stone'}`}
                  >
                    <span>हिन्दी</span>
                    {currentLang === 'hi' && <span className="material-symbols-outlined text-sage text-sm">check</span>}
                  </button>
                  <button
                    onClick={() => { setCurrentLang('te'); setIsLangOpen(false); }}
                    className={`w-full text-left px-4 py-3 text-sm font-bold transition-all hover:bg-foam flex items-center justify-between cursor-pointer ${currentLang === 'te' ? 'text-forest bg-foam' : 'text-stone'}`}
                  >
                    <span>తెలుగు</span>
                    {currentLang === 'te' && <span className="material-symbols-outlined text-sage text-sm">check</span>}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Area: Upload/Analysis */}
          <section className="lg:col-span-8 flex flex-col gap-8">
            <AnimatePresence mode="wait">
              {!result && (
                <motion.div
                  key="upload-area"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative group aspect-video md:h-[500px] bg-white rounded-[2.5rem] flex flex-col items-center justify-center border-2 border-dashed border-moss/10 hover:border-sage transition-all cursor-pointer overflow-hidden shadow-2xl shadow-forest/5"
                  onClick={!previewUrl ? triggerUpload : undefined}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />

                  {previewUrl ? (
                    <div className="relative w-full h-full">
                      <img src={previewUrl} className="w-full h-full object-cover" alt="Selected Preview" />

                      {/* Analysis Overlay */}
                      <AnimatePresence>
                        {isAnalyzing && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-forest/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-white"
                          >
                            {/* Scanning Bar Animation */}
                            <motion.div
                              className="absolute left-0 right-0 h-1 bg-mint shadow-[0_0_15px_#7CCF7F]"
                              animate={{ top: ['0%', '100%', '0%'] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            />
                            <div className="flex flex-col items-center gap-4 relative z-10">
                              <div className="w-16 h-16 border-4 border-white/20 border-t-mint rounded-full animate-spin" />
                              <h3 className="text-2xl font-serif font-bold tracking-wide">{t('analyzing')}</h3>
                              <p className="text-white/70 animate-pulse">{t('running')}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Floating Actions */}
                      {!isAnalyzing && (
                        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4">
                          <button
                            onClick={triggerUpload}
                            className="bg-white/90 backdrop-blur text-forest px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 hover:bg-white transition-all"
                          >
                            <span className="material-symbols-outlined">refresh</span> {t('change')}
                          </button>
                          <button
                            onClick={analyzeImage}
                            className="bg-forest text-white px-8 py-3 rounded-full font-bold shadow-xl shadow-forest/30 flex items-center gap-2 hover:scale-[1.05] transition-all"
                          >
                            <span className="material-symbols-outlined">bolt</span> {t('startScan')}
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center p-8">
                      <div className="w-24 h-24 bg-forest text-mint rounded-full flex items-center justify-center mb-6 shadow-xl shadow-forest/20 group-hover:scale-110 transition-transform duration-500">
                        <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>add_a_photo</span>
                      </div>
                      <h3 className="text-3xl font-serif font-bold text-forest mb-3">{t('uploadTitle')}</h3>
                      <p className="text-stone mb-8 max-w-sm text-lg">{t('uploadDesc')}</p>
                      <button className="bg-forest text-white px-10 py-4 rounded-full font-bold shadow-lg shadow-forest/20 flex items-center gap-3 hover:scale-[1.02] active:scale-95 transition-all text-lg">
                        <span className="material-symbols-outlined">upload</span>
                        {t('uploadBtn')}
                      </button>
                      <p className="mt-6 text-stone/50 text-sm font-medium uppercase tracking-widest">{t('uploadLimit')}</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Result State */}
              {result && (
                <motion.div
                  key="result-area"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-moss/10 printable-area"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="relative h-64 md:h-auto overflow-hidden">
                      <img src={previewUrl} className="w-full h-full object-cover" alt="Analyzed Leaf" />
                      <div className="absolute top-6 left-6">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-lg ${result.severity === 'Critical' ? 'bg-danger/80 text-white' :
                          result.severity === 'Moderate' ? 'bg-amber/80 text-white' :
                            'bg-sage/80 text-white'
                          }`}>
                          {t(result.severity)} {t('severity')}
                        </span>
                      </div>
                    </div>

                    <div className="p-8 md:p-12">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="text-4xl font-serif font-bold text-forest mb-2">{t(result.diseaseName)}</h3>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center text-sage font-bold">
                              <span className="material-symbols-outlined text-sm">verified</span>
                              <span className="ml-1 text-sm">{result.confidence}% {t('confidence')}</span>
                            </div>
                            <span className="text-stone text-xs">•</span>
                            <span className="text-stone text-xs font-medium">{t('analyzedJustNow')}</span>
                          </div>
                        </div>
                        <button
                          onClick={resetDetection}
                          className="w-10 h-10 rounded-full bg-foam flex items-center justify-center text-forest hover:bg-forest hover:text-white transition-all no-print"
                        >
                          <span className="material-symbols-outlined">close</span>
                        </button>
                      </div>

                      <div className="space-y-8">
                        <div>
                          <h4 className="text-xs font-bold text-stone uppercase tracking-widest mb-4 flex items-center gap-2">
                            <span className="w-6 h-[1px] bg-stone/30"></span> {t('symptomsDetected')}
                          </h4>
                          <ul className="grid grid-cols-1 gap-3">
                            {result.symptoms.map((s, i) => (
                              <li key={i} className="flex items-center gap-3 text-sm text-forest/80 bg-foam px-4 py-2.5 rounded-xl border border-moss/5">
                                <span className="w-1.5 h-1.5 rounded-full bg-sage flex-shrink-0" />
                                {t(s)}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-stone uppercase tracking-widest mb-4 flex items-center gap-2">
                            <span className="w-6 h-[1px] bg-stone/30"></span> {t('expertActionPlan')}
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-mist p-5 rounded-2xl border border-sage/10">
                              <div className="text-[10px] font-bold text-moss uppercase mb-2">{t('organicMethod')}</div>
                              <p className="text-sm font-medium text-forest leading-relaxed">{t(result.treatment.organic[0])}</p>
                            </div>
                            <div className="bg-parchment p-5 rounded-2xl border border-amber/10">
                              <div className="text-[10px] font-bold text-amber uppercase mb-2">{t('chemicalMethod')}</div>
                              <p className="text-sm font-medium text-soil leading-relaxed">{t(result.treatment.chemical[0])}</p>
                            </div>
                          </div>
                        </div>

                        <button 
                          onClick={() => window.print()}
                          className="w-full bg-night text-white py-4 rounded-2xl font-bold text-lg shadow-xl hover:bg-forest transition-all flex items-center justify-center gap-3 no-print"
                        >
                          <span className="material-symbols-outlined">download_done</span>
                          {t('downloadReport')}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Recent Scans Gallery */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-moss/10 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-forest">{t('recentScans')}</h3>
                  <p className="text-stone text-sm">{t('diagnosticHistory')}</p>
                </div>
                <button className="text-sage font-bold text-sm hover:underline px-4 py-2 rounded-lg hover:bg-foam transition-all">{t('viewFullHistory')}</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {history.length > 0 ? (
                  history.slice(0, 3).map((scan, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ y: -5 }}
                      className="bg-foam p-4 rounded-[2rem] border border-moss/5 group cursor-pointer"
                    >
                      <div className="relative overflow-hidden rounded-2xl mb-4 h-32">
                        <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={scan.diseaseName} src={i === 0 ? "https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?auto=format&fit=crop&q=80&w=400" : i === 1 ? "https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&q=80&w=400" : "https://images.unsplash.com/photo-1558350315-8aa00e8e4590?auto=format&fit=crop&q=80&w=400"} />
                        <div className="absolute top-2 right-2 px-2 py-0.5 bg-white/90 backdrop-blur rounded-full text-[9px] font-bold text-forest">
                          {scan.confidence}%
                        </div>
                      </div>
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-bold text-forest text-sm">{t(scan.diseaseName)}</p>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${scan.severity === 'Critical' ? 'bg-danger/10 text-danger' :
                          scan.severity === 'Moderate' ? 'bg-amber/10 text-amber' :
                            'bg-mint/20 text-moss'
                          }`}>
                          {t(scan.severity)}
                        </span>
                      </div>
                      <p className="text-[10px] text-stone font-medium">{new Date(scan.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-3 py-12 text-center border-2 border-dashed border-moss/10 rounded-2xl">
                    <p className="text-stone font-medium">{t('noHistory')}</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Instructions & Tips (Sidebar Area) */}
          <aside className="lg:col-span-4 flex flex-col gap-8">
            {/* 3-Step Guide */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border-l-8 border-l-sage shadow-sm border border-moss/10">
              <h3 className="text-2xl font-serif font-bold text-forest mb-8">{t('photoGuide')}</h3>

              <div className="space-y-10">
                <div className="flex gap-5">
                  <div className="flex-shrink-0 w-10 h-10 bg-forest text-mint rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg shadow-forest/20">1</div>
                  <div>
                    <h4 className="font-bold text-forest mb-1.5 text-lg">{t('step1Title')}</h4>
                    <p className="text-sm text-stone leading-relaxed">{t('step1Desc')}</p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="flex-shrink-0 w-10 h-10 bg-forest text-mint rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg shadow-forest/20">2</div>
                  <div>
                    <h4 className="font-bold text-forest mb-1.5 text-lg">{t('step2Title')}</h4>
                    <p className="text-sm text-stone leading-relaxed">{t('step2Desc')}</p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="flex-shrink-0 w-10 h-10 bg-forest text-mint rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg shadow-forest/20">3</div>
                  <div>
                    <h4 className="font-bold text-forest mb-1.5 text-lg">{t('step3Title')}</h4>
                    <p className="text-sm text-stone leading-relaxed">{t('step3Desc')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Weather Alert Overlay */}
            <div className="relative rounded-[2.5rem] overflow-hidden h-72 group shadow-xl">
              <img className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]" alt="Background Field" src="https://images.unsplash.com/photo-1473081556163-2a17de81fc97?auto=format&fit=crop&q=80&w=800" />
              <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/40 to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/10 backdrop-blur-xl rounded-[2rem] border border-white/20 text-white">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-mint">Microclimate Alert</span>
                  <span className="material-symbols-outlined text-gold animate-pulse">wb_sunny</span>
                </div>
                <div className="flex items-baseline gap-2 mb-1">
                  <p className="text-4xl font-serif font-bold text-white">84%</p>
                  <p className="text-sm font-medium text-white/70">Humidity</p>
                </div>
                <p className="text-xs text-white/90 leading-relaxed font-bold border-l-2 border-gold pl-3 mt-4">
                  High humidity detected in Pune region. <span className="text-gold">Early Blight risk</span> is elevated for tomato crops.
                </p>
              </div>
            </div>

            {/* Expert Support CTA */}
            <div className="bg-forest text-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-forest/30 relative overflow-hidden">
              <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-gold/10 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <h4 className="text-2xl font-serif font-bold mb-4">{t('needExpert')}</h4>
                <p className="text-white/70 mb-8 leading-relaxed text-sm">{t('expertDesc')}</p>
                <button className="w-full bg-gold text-forest py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-straw transition-all shadow-lg shadow-gold/20 transform hover:-translate-y-1">
                  <span className="material-symbols-outlined">support_agent</span>
                  {t('connectExpert')}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-cream/95 backdrop-blur-xl shadow-[0_-10px_30px_rgba(0,0,0,0.05)] flex justify-around items-center z-50 border-t border-moss/10 px-6">
        <button className="flex flex-col items-center gap-1.5 text-stone transition-all active:scale-90">
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-forest scale-110">
          <div className="relative">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-gold rounded-full border-2 border-cream" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Detect</span>
        </button>
        <button onClick={() => onModuleSwitch?.('soil')} className="flex flex-col items-center gap-1.5 text-stone transition-all active:scale-90">
          <span className="material-symbols-outlined">agriculture</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Soil</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-stone transition-all active:scale-90">
          <span className="material-symbols-outlined">account_circle</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default DiseaseDetection;
