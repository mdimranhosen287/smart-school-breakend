export const defaultLegacySections = {
  aboutEnabled: true,
  statsEnabled: true,
  featuresEnabled: true,
  committeeEnabled: true,
  speechEnabled: true,
  galleryEnabled: true,
  faqEnabled: true,
  noticeEnabled: true,
  testimonialEnabled: true,
  serviceEnabled: true,
};

export const defaultSectionsList = [
  { id: 'banner', nameEn: 'Homepage Banner', nameBn: 'হোমপেজ ব্যানার', descriptionEn: 'Hero banner slider section with major headings and CTA button', descriptionBn: 'মূল শিরোনাম এবং ভর্তি বাটনসহ প্রধান ব্যানার স্লাইডার সেকশন', order: 1, status: true },
  { id: 'notice', nameEn: 'Notice Board', nameBn: 'নোটিশ বোর্ড', descriptionEn: 'Latest notices and academic announcements', descriptionBn: 'সর্বশেষ নোটিশ এবং শিক্ষাগত ঘোষণা', order: 2, status: true },
  { id: 'speech', nameEn: 'Principal Speech', nameBn: 'প্রধান শিক্ষকের বাণী', descriptionEn: 'Welcoming address and message from the school headmaster', descriptionBn: 'विद्यालयয়ের প্রধান শিক্ষকের স্বাগত বক্তব্য ও বাণী', order: 3, status: true },
  { id: 'about', nameEn: 'About School / History', nameBn: 'বিদ্যালয় পরিচিতি ও ইতিহাস', descriptionEn: 'Brief summary of the school history and background metrics', descriptionBn: 'বিদ্যালয়ের ইতিহাস এবং পরিসংখ্যানের সংক্ষিপ্ত বিবরণ', order: 4, status: true },
  { id: 'features', nameEn: 'Core Features / Strengths', nameBn: 'মূল বৈশিষ্ট্যসমূহ', descriptionEn: 'Key academic facilities, security and modern amenities', descriptionBn: 'প্রধান শিক্ষাগত সুবিধা, নিরাপত্তা ও আধুনিক সুযোগ-সুবিধা', order: 5, status: true },
  { id: 'committee', nameEn: 'Governing Body / Committee', nameBn: 'পরিচালনা পর্ষদ', descriptionEn: 'Governing body members and administrative panel', descriptionBn: 'কমিটি সদস্যবৃন্দ এবং প্রশাসনিক প্যানেল', order: 6, status: true },
  { id: 'gallery', nameEn: 'Photo Gallery', nameBn: 'ফটো গ্যালারি', descriptionEn: 'Campus celebration and activities image gallery', descriptionBn: 'ক্যাম্পাস উৎসব এবং কার্যক্রমের ছবি গ্যালারি', order: 7, status: true },
  { id: 'testimonial', nameEn: 'Testimonials / Success Stories', nameBn: 'কৃতী শিক্ষার্থী ও প্রশংসাপত্র', descriptionEn: 'Success statements from alumni, guardians and achievements', descriptionBn: 'প্রাক্তন শিক্ষার্থী এবং অভিভাবকদের প্রশংসা বাণী', order: 8, status: true },
  { id: 'service', nameEn: 'Special Guidance / Services', nameBn: 'বিশেষ সেবা ও নির্দেশনা', descriptionEn: 'Transport facilities, special classes and guidance plans', descriptionBn: 'পরিবহন সুবিধা, বিশেষ ক্লাস এবং অন্যান্য সেবা', order: 9, status: true },
  { id: 'faq', nameEn: 'FAQ Accordion', nameBn: 'সচরাচর জিজ্ঞাসা (FAQ)', descriptionEn: 'Frequently asked questions with brief helpful answers', descriptionBn: 'সাধারণ প্রশ্নাবলী এবং সহজ সমাধান', order: 10, status: true }
];

export const defaultFullData = {
  banner: {
    titleBn: "আনন্দমুখর শিক্ষাদান ও শিক্ষার্থীদের উচ্ছ্বাস",
    titleEn: "Joyful Learning & Student Vibrancy",
    subtitleBn: "স্টুডেন্টস কেয়ার মডেল স্কুলে প্রতিটি দিনই নতুন কিছু শেখার এবং উদযাপনের।",
    subtitleEn: "Every day at Students Care Model School is a new journey of learning and celebration.",
    btnTextBn: "ভর্তি ফরম পূরণ করুন",
    btnTextEn: "Fill Admission Form",
  },
  settings: {
    siteNameBn: "স্টুডেন্টস কেয়ার মডেল স্কুল",
    siteNameEn: "STUDENTS CARE MODEL SCHOOL",
    helpline: "+880 1814913049",
    email: "studentscare2006@gmail.com",
    addressBn: "চরলক্ষ্যা, কর্ণফুলী, চট্টগ্রাম",
    addressEn: "Charalakshya, Karnafuli, Chattogram",
    eiin: "471547",
    foundedYear: "2018",
    website: "Students Care",
    bannerColor: "#1E63D3",
    bannerFontSize: 32,
    bannerGradient: true,
    logoUrl: "",
  },
  menu: [
    { id: '1', titleBn: 'হোম', titleEn: 'Home', link: '#home' },
    { id: '2', titleBn: 'আমাদের সম্পর্কে', titleEn: 'About Us', link: '#about' }
  ],
  slider: [
    { id: '1', titleBn: 'অভিজ্ঞ শিক্ষক মণ্ডলী', titleEn: 'Experienced Faculty Members', descBn: 'আমাদের রয়েছে দক্ষ ও অভিজ্ঞ শিক্ষকমণ্ডলী।', descEn: 'Our classes are led by top subject matter experts.' },
    { id: '2', titleBn: 'ডিজিটাল মাল্টিমিডিয়া ক্লাস', titleEn: 'Digital Multimedia Classrooms', descBn: 'স্মার্ট ক্লাসরুম প্রযুক্তিতে পাঠদান।', descEn: 'Empowering students via modern computer labs.' }
  ],
  features: [
    { id: '1', titleBn: 'মানসম্মত শিক্ষা', titleEn: 'Quality Education', descBn: 'আধুনিক কারিকুলাম ও নৈতিক শিক্ষার সমন্বয়।', descEn: 'Blending state curricula with ethical grooming.' },
    { id: '2', titleBn: 'নিরাপদ ক্যাম্পাস', titleEn: 'Safe Campus', descBn: 'সিসিটিভি দ্বারা নিয়ন্ত্রিত সুরক্ষিত ক্যাম্পাস।', descEn: 'Fully secured under 24/7 camera monitoring.' },
    { id: '3', titleBn: 'সহশিক্ষা কার্যক্রম', titleEn: 'Co-curricular Activities', descBn: 'ডিবেট, স্পোর্টস ও সাংস্কৃতিক চর্চা।', descEn: 'Promoting debate, scout, arts, and athletics.' }
  ],
  committee: [
    { id: '1', name: 'Md. Imran Hosen', designationBn: 'প্রতিষ্ঠাতা ও সভাপতি', designationEn: 'Founder & Chairman', photo: '' },
    { id: '2', name: 'Dr. Mahmudul Hasan', designationBn: 'সহ-সভাপতি', designationEn: 'Vice Chairman', photo: '' },
    { id: '3', name: 'Zakir Hosen', designationBn: 'কমিটি সদস্য', designationEn: 'Governing Body Member', photo: '' }
  ],
  speech: {
    speakerNameBn: "মোরশেদ নূর",
    speakerNameEn: "Morshed Nur",
    designationBn: "প্রধান শিক্ষক, স্টুডেন্টস কেয়ার মডেল স্কুল",
    designationEn: "Headmaster, Students Care Model School",
    contentBn: "আসসালামু আলাইকুম। স্টুডেন্টস কেয়ার মডেল স্কুলের পক্ষ থেকে সকলকে শুভেচ্ছা। আমরা শুধু পাঠ্যপুস্তকের শিক্ষাতেই সীমাবদ্ধ নই, আমাদের লক্ষ্য প্রতিটি শিক্ষার্থীকে একজন দেশপ্রেমিক, নৈতিকতাসম্পন্ন এবং আইটি-দক্ষ বৈশ্বিক নাগরিক হিসেবে গড়ে তোলা। আধুনিক শিক্ষার আলো ঘরে ঘরে পৌঁছে দিতে আমাদের এই ক্ষুদ্র প্রয়াস। সকলের সহযোগিতা কামনা করছি।",
    contentEn: "Assalamu Alaikum. Warm greetings from Students Care Model School. We do not believe in rote learning or textbooks alone. Our ultimate vision is to build every student into a patriotic, morally upright, and IT-skilled global citizen. We strive to spread the light of quality education in every household. We seek your prayer and support.",
    headmasterPhoto: "",
    asstSpeakerNameBn: "মো: তৈয়ব হোসেন",
    asstSpeakerNameEn: "Md. Toyub Hosen",
    asstDesignationBn: "সহকারী প্রধান শিক্ষক, স্টুডেন্টস কেয়ার মডেল স্কুল",
    asstDesignationEn: "Asst. Headmaster, Students Care Model School",
    asstContentBn: "শৃঙ্খলা ও কঠোর পরিশ্রমই সাফল্যের মূল চাবিকাঠি। আমাদের শিক্ষাপ্রতিষ্ঠানে শিক্ষার্থীদের পাঠদানের পাশাপাশি নিয়মানুবর্তিতা, নৈতিকতা ও সৃজনশীল কার্যক্রমের উপর বিশেষ গুরুত্ব দেওয়া হয়। আধুনিক সুযোগ-সুবিধা ও মনোরম পরিবেশে পাঠদানের মাধ্যমে আমরা শিক্ষার্থীদের ভবিষ্যৎ গড়তে সদা প্রস্তুত।",
    asstContentEn: "Discipline and hard work are the fundamental keys to success. In our school, alongside regular academic syllabus learning, we emphasize discipline, ethics, and co-curricular creativity. With modern campus facilities and an encouraging environment, we are always prepared to build the future of our candidates.",
    asstHeadmasterPhoto: ""
  },
  testimonial: [
    { id: '1', author: 'Dr. Rafiqul Islam', roleBn: 'অভিভাবক', roleEn: 'Guardian', textBn: 'স্কুলের পড়াশোনার মান ও শৃঙ্খলা সত্যিই প্রশংসনীয়। আমার সন্তান পড়াশোনায় অনেক উন্নতি করেছে।', textEn: 'The educational quality and strict discipline are commendable. My child has improved immensely.' },
    { id: '2', author: 'Nusrat Jahan', roleBn: 'প্রাক্তন শিক্ষার্থী', roleEn: 'Alumni', textBn: 'এই স্কুলে কাটানো সময়গুলো আমার জীবনের অন্যতম সেরা অর্জন। শিক্ষকরা অত্যন্ত যত্নশীল।', textEn: 'The years spent here were the most transformative of my life. The teachers are incredibly caring.' }
  ],
  services: [
    { id: '1', titleBn: 'বিশেষ যত্ন', titleEn: 'Special Guidance', descBn: 'দুর্বল শিক্ষার্থীদের জন্য অতিরিক্ত ওয়ান-টু-ওয়ান কেয়ার ক্লাস।', descEn: 'Extra hours of tutorial assistance for slower learners.' },
    { id: '2', titleBn: 'পরিবহন সুবিধা', titleEn: 'School Bus Transportation', descBn: 'নিরাপদ যাতায়াতের জন্য নিজস্ব বাসের ব্যবস্থা।', descEn: 'Secured student buses mapping all local routes.' }
  ],
  faqs: [
    { id: '1', qBn: 'ভর্তির যোগ্যতা কী?', qEn: 'What is the entry criteria?', aBn: 'ভর্তি পরীক্ষার মেধা তালিকায় উত্তীর্ণ হতে হবে।', aEn: 'Requires passing the core descriptive admission tests.' }
  ],
  galleryCategories: ['All', 'Campus', 'Celebration', 'Classroom', 'Sports'],
  gallery: [
    { id: '1', category: 'Campus', captionBn: 'মনোরম স্কুল ক্যাম্পাস', captionEn: 'Scenic Main Campus', img: '' },
    { id: '2', category: 'Classroom', captionBn: 'বিজ্ঞানাগারে ব্যবহারিক ক্লাস', captionEn: 'Practical Science Laboratory', img: '' }
  ],
  news: [
    { id: '1', titleBn: 'বার্ষিক ক্রীড়া প্রতিযোগিতা ২০২৬ সম্পন্ন', titleEn: 'Annual Sports Competition 2026 Concluded', date: '2026-06-15', descBn: 'উৎসবমুখর পরিবেশে বার্ষিক ক্রীড়া প্রতিযোগিতা সম্পন্ন হয়েছে।', descEn: 'The annual tournament ended with massive joy and awards distribution.' }
  ],
  fastLinks: [
    { id: '1', labelBn: 'ভর্তি নির্দেশিকা', labelEn: 'Admission Guide', url: '#' },
    { id: '2', labelBn: 'সিলেবাস ২০২৬', labelEn: 'Academic Syllabus 2026', url: '#' }
  ],
  history: {
    established: "২০১৫",
    contentBn: "স্টুডেন্টস কেয়ার মডেল স্কুলটি ২০১৫ সালে কর্ণফুলী এলাকার সাধারণ শিক্ষার্থীদের মানসম্মত আধুনিক শিক্ষা নিশ্চিত করার লক্ষ্যে প্রতিষ্ঠিত হয়। হাঁটি হাঁটি পা পা করে আজ স্কুলটি চট্টগ্রামের অন্যতম সেরা শিক্ষাপ্রতিষ্ঠানে রূপ নিয়েছে।",
    contentEn: "Students Care Model School was founded in 2015 with the vision of offering elite-standard modern schooling. Today, it has established itself as a premier academic beacon in Chattogram."
  },
  masterpieceStudents: [
    { id: '1', name: 'Tanvir Rahman', gpa: 'GPA 5.00', year: 'SSC 2025', achievementBn: 'গোল্ডেন এ+', achievementEn: 'Golden A+' },
    { id: '2', name: 'Sumaiya Aktar', gpa: 'GPA 5.00', year: 'SSC 2025', achievementBn: 'গোল্ডেন এ+', achievementEn: 'Golden A+' }
  ],
  videos: [
    { id: '1', titleBn: 'স্কুল ক্যাম্পাসের ড্রোন ভিডিও', titleEn: 'Drone tour of our campus', url: 'https://youtube.com/embed/demo1' }
  ],
  blogPosts: [
    { id: '1', titleBn: 'স্মার্ট ক্লাসরুম কীভাবে শিক্ষাদানে বিপ্লব ঘটাচ্ছে', titleEn: 'How Smart Classrooms are revolutionizing pedagogy', date: '2026-07-02', author: 'Principal desk' }
  ],
  customPages: [
    {
      id: "admission-criteria",
      titleBn: "ভর্তির যোগ্যতা ও নীতিমালা",
      titleEn: "Admission Criteria & Policy",
      slug: "admission-criteria",
      contentBn: "১. নার্সারি থেকে প্লে গ্রুপের জন্য সরাসরি সাক্ষাৎকার নেওয়া হবে।\n২. ১ম থেকে ৯ম শ্রেণীর জন্য লিখিত ও মৌখিক পরীক্ষার ভিত্তিতে মূল্যায়ন করা হবে।\n৩. প্রয়োজনীয় কাগজপত্র:\n- জন্মনিবন্ধন সনদের ডিজিটাল কপি\n- বিগত বছরের রিপোর্ট কার্ড\n- ২ কপি পাসপোর্ট সাইজ ছবি।",
      contentEn: "1. Admissions for Play Group and Nursery will be based on simple verbal interaction.\n2. Classes I to IX will require passing a written admission test.\n3. Documents Required:\n- Digital Copy of Birth Certificate\n- Academic Transcript / Report Card of previous class\n- 2 passport-sized photographs.",
      showInMenu: true,
      menuOrder: 1,
      status: "active"
    }
  ],
  sections: defaultLegacySections,
  sectionsList: defaultSectionsList
};

export const getMergedFrontendData = (saved: string | null): any => {
  if (!saved) return defaultFullData;
  try {
    const parsed = JSON.parse(saved);
    if (!parsed || typeof parsed !== 'object') return defaultFullData;
    
    return {
      ...defaultFullData,
      ...parsed,
      banner: { ...defaultFullData.banner, ...(parsed.banner || {}) },
      settings: { ...defaultFullData.settings, ...(parsed.settings || {}) },
      speech: { ...defaultFullData.speech, ...(parsed.speech || {}) },
      history: { ...defaultFullData.history, ...(parsed.history || {}) },
      sections: parsed.sections ? { ...defaultLegacySections, ...parsed.sections } : defaultLegacySections,
      sectionsList: parsed.sectionsList && parsed.sectionsList.length > 0 ? parsed.sectionsList : defaultSectionsList,
      customPages: parsed.customPages || defaultFullData.customPages,
      slider: parsed.slider || defaultFullData.slider,
      features: parsed.features || defaultFullData.features,
      committee: parsed.committee || defaultFullData.committee,
      testimonial: parsed.testimonial || defaultFullData.testimonial,
      services: parsed.services || defaultFullData.services,
      faqs: parsed.faqs || defaultFullData.faqs,
      galleryCategories: parsed.galleryCategories || defaultFullData.galleryCategories,
      gallery: parsed.gallery || defaultFullData.gallery,
      news: parsed.news || defaultFullData.news,
      fastLinks: parsed.fastLinks || defaultFullData.fastLinks,
      masterpieceStudents: parsed.masterpieceStudents || defaultFullData.masterpieceStudents,
      videos: parsed.videos || defaultFullData.videos,
      blogPosts: parsed.blogPosts || defaultFullData.blogPosts
    };
  } catch (e) {
    console.error("Error merging frontend data", e);
    return defaultFullData;
  }
};
