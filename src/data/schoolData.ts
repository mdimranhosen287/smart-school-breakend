/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Notice, AcademicProgram, Event, Teacher, FAQItem, StudentProfile, HomeworkItem, ExamResult } from '../types';

export const schoolInfo = {
  name: "Students Care Model School",
  bengaliName: "স্টুডেন্টস কেয়ার মডেল স্কুল",
  slogan: "We Care, We Educate, We Excel",
  bengaliSlogan: "চরলক্ষ্যা, কর্ণফুলী, চট্টগ্রাম",
  established: 2018,
  eiin: "138456",
  code: "47154",
  address: "Charlakshya, Karnaphuli, Chattogram, Bangladesh",
  phone: "+880 1812-345678, +880 1876-543210",
  email: "info@studentscaremodelschool.edu.bd",
  stats: {
    students: "1,000+",
    teachers: "40+",
    labs: "3",
    successRate: "100%"
  }
};

export const notices: Notice[] = [
  {
    id: "N001",
    title: "Half-Yearly Examination 2026 Routine Published",
    category: "exam",
    date: "2026-07-02",
    content: "The routine for the Half-Yearly Examination 2026 has been published for Grades 1 to 12. Students are advised to collect their admit cards from the office after clearing all outstanding fees. Exams will commence from July 15th, 2026. The detailed schedule has been sent via student portals.",
    urgent: true,
    author: "Controller of Examinations"
  },
  {
    id: "N002",
    title: "Admission Open for Session 2026-2027",
    category: "academic",
    date: "2026-06-28",
    content: "Online application for admission into Nursery to Class IX for the upcoming academic session 2026-2027 is now open. Parents can submit the online application form directly via our admissions portal. The last date of submission is October 15th, 2026. Admission test syllabus is available for download.",
    urgent: true,
    author: "Admissions Committee"
  },
  {
    id: "N003",
    title: "Celebration of National Science and Tech Fair 2026",
    category: "event",
    date: "2026-06-25",
    content: "Our school is hosting the Intra-School Science and Technology Fair on July 10th, 2026. Students from Class VI to XII can register their projects under Senior, Intermediate, and Junior categories. Please contact your class teacher or the Science Club moderator to register by July 5th.",
    urgent: false,
    author: "Science Club Moderator"
  },
  {
    id: "N004",
    title: "Inter-School Football Tournament Final Match",
    category: "sports",
    date: "2026-06-20",
    content: "Dhaka Modern Academy's senior football team has reached the final of the Dhaka Inter-School Football Championship! The final match against Uttara Boys High School will take place on July 8th, 2026 at 3:30 PM in the Sector 11 Playground. All students are encouraged to attend and cheer for our team.",
    urgent: false,
    author: "Sports Instructor"
  },
  {
    id: "N005",
    title: "Guidelines for Monsoon Health and Hygiene",
    category: "general",
    date: "2026-06-15",
    content: "With the arrival of the monsoon season, we request all parents and students to follow health guidelines to prevent dengue and water-borne illnesses. Full-sleeve uniforms are highly recommended. The school campus is being sprayed regularly for mosquito control.",
    urgent: false,
    author: "School Health Unit"
  }
];

export const events: Event[] = [
  {
    id: "E001",
    title: "Annual Cultural Fest & Prize Distribution",
    date: "2026-07-28",
    time: "10:00 AM - 4:00 PM",
    venue: "School Auditorium",
    description: "An eventful day celebrating the cultural talents of our students, followed by awarding the top achievers of academic and co-curricular fields for the past academic term.",
    category: "Cultural"
  },
  {
    id: "E002",
    title: "Intra-School Science & Robotics Exhibition",
    date: "2026-07-10",
    time: "09:00 AM - 3:00 PM",
    venue: "Main Campus Grounds & Physics Lab",
    description: "Explore the fascinating world of science through creative models, experiments, and code-based robotics designed completely by our students.",
    category: "Academic"
  },
  {
    id: "E003",
    title: "Parent-Teacher Association (PTA) Meeting",
    date: "2026-07-20",
    time: "10:00 AM - 1:00 PM",
    venue: "Respective Classrooms",
    description: "An opportunity for parents to meet one-on-one with class teachers to discuss the academic progress, attendance, and welfare of their children.",
    category: "General"
  }
];

export const academicPrograms: AcademicProgram[] = [
  {
    level: "Primary Division (Nursery - Class V)",
    grades: "Nursery to Class V",
    description: "A nurturing and playful learning environment focusing on cognitive development, basic literacy, numeracy, and social integration. We follow a hybrid curriculum blending national guidelines with modern activity-based learning.",
    subjects: ["English Language", "Bangla Language", "Mathematics", "Elementary Science", "Bangladesh and Global Studies", "Art & Craft", "Moral Education"],
    activities: ["Spelling Bee", "Storytelling", "Arts & Crafts Club", "Kid's Yoga", "Music Classes"],
    coordinator: "Mrs. Shamima Sultana, M.Ed"
  },
  {
    level: "Secondary Division (Class VI - Class X)",
    grades: "Class VI to Class X",
    description: "Transitioning students into deeper analytical thinking and self-discovery. Preparation for the Secondary School Certificate (SSC) examinations under the National Curriculum and Textbook Board (NCTB) with choices in Science and Commerce streams.",
    subjects: ["Bangla Literature & Grammar", "English Literature & Composition", "General Mathematics", "Higher Mathematics", "Physics", "Chemistry", "Biology", "Accounting", "Business Ent.", "Finance & Banking", "ICT"],
    activities: ["Science & Robotics Club", "Debating Society", "Scouts & Girls Guide", "School Band", "Football & Cricket Team"],
    coordinator: "Mr. Abdul Hye, M.Sc (Physics)"
  },
  {
    level: "Higher Secondary Division (Class XI - XII)",
    grades: "Class XI & Class XII (College)",
    description: "Rigorous academic preparation for Higher Secondary Certificate (HSC) examinations and competitive university admission tests. Special guidance, career counseling, and intensive lab work are provided.",
    subjects: ["Bangla", "English", "ICT", "Physics", "Chemistry", "Mathematics", "Biology", "Accounting", "Business Organization", "Finance", "Economics"],
    activities: ["HSC Booster Sessions", "Olympiad Programming Group", "Model United Nations (MUN)", "Social Service Club"],
    coordinator: "Dr. Farhana Rahman, Ph.D in Chemistry"
  }
];

export const teachers: Teacher[] = [
  {
    id: "T001",
    name: "Mr. M. A. Hasan",
    designation: "Principal",
    department: "Administration",
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400",
    qualification: "M.A. in English (DU), Ex-Cadet College Lecturer",
    email: "principal@dhakamodernacademy.edu.bd"
  },
  {
    id: "T002",
    name: "Mrs. Shamima Sultana",
    designation: "Assistant Headmistress & Primary Head",
    department: "Primary Division",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    qualification: "M.Ed (IER, Dhaka University), B.Ed",
    email: "shamima.s@dhakamodernacademy.edu.bd"
  },
  {
    id: "T003",
    name: "Mr. Abdul Hye",
    designation: "Senior Teacher (Physics)",
    department: "Secondary Division",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400",
    qualification: "M.Sc & B.Sc in Physics (JU)",
    email: "abdulhye.physics@dhakamodernacademy.edu.bd"
  },
  {
    id: "T004",
    name: "Dr. Farhana Rahman",
    designation: "Assistant Professor (Chemistry)",
    department: "Higher Secondary Division",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400",
    qualification: "Ph.D in Chemistry (RU), Ex-Research Fellow",
    email: "farhana.chem@dhakamodernacademy.edu.bd"
  },
  {
    id: "T005",
    name: "Mr. Rafiqul Islam",
    designation: "Senior Instructor",
    department: "Mathematics",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
    qualification: "M.Sc in Applied Mathematics (DU)",
    email: "rafiqul.math@dhakamodernacademy.edu.bd"
  }
];

export const galleryItems = [
  {
    id: "G001",
    title: "International Mother Language Day Observance",
    category: "Culture",
    image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=600",
    description: "Students paying deep respect to language martyrs at our self-made Shaheed Minar on February 21."
  },
  {
    id: "G002",
    title: "High-Tech Science Exhibition",
    category: "Academic",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=600",
    description: "Students demonstrating eco-friendly solar-grid systems during the science fair."
  },
  {
    id: "G003",
    title: "Annual Sports Athletics Competition",
    category: "Sports",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=600",
    description: "The thrilling 100m sprint finals at the National Stadium where our students won 5 medals."
  },
  {
    id: "G004",
    title: "Physics Lab Research Session",
    category: "Lab",
    image: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=600",
    description: "HSC Students conducting optical bench experiments in the newly renovated physics laboratory."
  },
  {
    id: "G005",
    title: "Prize Giving Ceremony",
    category: "Culture",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=600",
    description: "Honorable guests handing over trophies to academic toppers and co-curricular heroes."
  },
  {
    id: "G006",
    title: "Computer Coding Class",
    category: "Lab",
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&q=80&w=600",
    description: "Primary students learning standard logical reasoning and block programming in ICT lab."
  }
];

export const faqs: FAQItem[] = [
  {
    id: "F001",
    question: "What curriculum does Dhaka Modern Academy follow?",
    answer: "We strictly follow the National Curriculum and Textbook Board (NCTB) in English Version and Bangla Version from Nursery to Class XII, preparing students for SSC and HSC exams."
  },
  {
    id: "F002",
    question: "How can I apply for admission?",
    answer: "You can apply easily through our online admission application form accessible on this website under the 'Admissions' section. Provide candidate and guardian details, select class, upload details, and submit."
  },
  {
    id: "F003",
    question: "Are there transport facilities available for students?",
    answer: "Yes, the academy offers AC and non-AC school buses covering Uttara, Mirpur, Khilkhet, Nikunja, and Tongi areas. Contact the transport desk for routes, fees, and pickup/drop timings."
  },
  {
    id: "F004",
    question: "What are the co-curricular activities provided?",
    answer: "We strongly support holistic growth. Co-curricular active groups include debating, robotics & programming, scouting, cultural clubs (music, recitation, drama), and active sports leagues for cricket and football."
  },
  {
    id: "F005",
    question: "Is there a student portal and how can we log in?",
    answer: "Yes! There is a mock student portal integrated right into this website. You can log in using the ID '2026105' and password 'student' to view profile, attendance record, live exams results, and daily homework."
  }
];

export const mockStudentProfile: StudentProfile = {
  id: "2026105",
  name: "Imran Hosen",
  roll: 5,
  className: "Class IX",
  section: "A (Science)",
  guardian: "Md. Rafiqul Hosen",
  phone: "+880 1712-987654",
  bloodGroup: "O+ Pos",
  attendanceRate: 94.5
};

export const mockHomework: HomeworkItem[] = [
  {
    id: "HW001",
    subject: "Physics",
    title: "Complete Wave & Sound Chapter Math Exercise",
    dueDate: "2026-07-08",
    status: "pending",
    description: "Solve problems 1 to 15 from page 142. Note down any confusion regarding the frequency equations."
  },
  {
    id: "HW002",
    subject: "Mathematics",
    title: "Geometry - Prove Theorems on Circles",
    dueDate: "2026-07-06",
    status: "completed",
    description: "Prove Theorem 20 and 21 on a clean notebook. Take clear photos and submit."
  },
  {
    id: "HW003",
    subject: "Bangla Literature",
    title: "Write Summary of Poem 'Kabar'",
    dueDate: "2026-07-09",
    status: "pending",
    description: "Write an elegant 150-word summary of Jasimuddin's famous poem 'Kabar' showing deep themes."
  }
];

export const mockExamResults: ExamResult[] = [
  { subject: "Bangla Language", marks: 88, grade: "A+", maxMarks: 100 },
  { subject: "English Literature", marks: 92, grade: "A+", maxMarks: 100 },
  { subject: "General Mathematics", marks: 95, grade: "A+", maxMarks: 100 },
  { subject: "Higher Mathematics", marks: 89, grade: "A+", maxMarks: 100 },
  { subject: "Physics", marks: 84, grade: "A", maxMarks: 100 },
  { subject: "Chemistry", marks: 91, grade: "A+", maxMarks: 100 },
  { subject: "Biology", marks: 87, grade: "A+", maxMarks: 100 },
  { subject: "ICT & Coding", marks: 97, grade: "A+", maxMarks: 100 }
];
