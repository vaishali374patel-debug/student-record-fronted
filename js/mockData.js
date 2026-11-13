/**
 * Initial Mock Data for Student Activity Record System
 * Loaded into localStorage on first run if no stored data exists.
 */
const INITIAL_DATA = {
    users: [
        {
            id: "USR-001",
            name: "Aarav Sharma",
            email: "aarav.student@college.edu",
            password: "password123",
            role: "STUDENT",
            department: "Computer Science and Engineering",
            rollNumber: "2023CSE042",
            semester: "VI Semester",
            cgpa: 8.85,
            phone: "+91 98765 43210",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
        },
        {
            id: "USR-002",
            name: "Dr. Priya Nair",
            email: "priya.nair@college.edu",
            password: "password123",
            role: "FACULTY",
            department: "Computer Science and Engineering",
            designation: "Associate Professor & NAAC Activity Coordinator",
            facultyId: "FAC-CSE-108",
            avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
        },
        {
            id: "USR-003",
            name: "Prof. Rajesh Kumar Verma",
            email: "admin@college.edu",
            password: "admin123",
            role: "ADMIN",
            department: "Dean Academic Affairs & IQAC Cell",
            designation: "Dean of Academics & IQAC Director",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
        }
    ],

    departments: [
        { code: "CSE", name: "Computer Science and Engineering", totalStudents: 420 },
        { code: "ECE", name: "Electronics & Communication Engineering", totalStudents: 360 },
        { code: "MECH", name: "Mechanical Engineering", totalStudents: 280 },
        { code: "CIVIL", name: "Civil Engineering", totalStudents: 210 },
        { code: "IT", name: "Information Technology", totalStudents: 310 }
    ],

    activities: [
        {
            id: "ACT-1001",
            studentId: "USR-001",
            studentName: "Aarav Sharma",
            rollNumber: "2023CSE042",
            department: "Computer Science and Engineering",
            title: "Smart India Hackathon 2025 - Grand Finale Winner",
            category: "TECHNICAL",
            organization: "Ministry of Education Innovation Cell, Govt of India",
            eventDate: "2025-12-20",
            submissionDate: "2025-12-22",
            hoursSpent: 48,
            description: "Developed an AI-driven smart traffic monitoring and emergency corridor management system. Secured 1st place in Hardware/Software Edition.",
            certificate: {
                fileName: "SIH2025_FirstPrize_Aarav.pdf",
                fileSize: "1.4 MB",
                fileHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                fileUrl: "https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=800&auto=format&fit=crop&q=80"
            },
            verification: {
                status: "AUTO_APPROVED",
                confidenceScore: 96,
                decision: "High Confidence Match",
                ocrExtracted: {
                    nameMatched: true,
                    extractedName: "AARAV SHARMA",
                    extractedTitle: "Smart India Hackathon 2025 - Grand Finale",
                    extractedOrg: "Ministry of Education Innovation Cell",
                    extractedDate: "2025-12-20",
                    qrCodeUrl: "https://innovations.gov.in/verify/SIH25-CSE-9901",
                    qrVerified: true
                },
                checks: [
                    { name: "Duplicate File Hash", passed: true, detail: "Unique SHA-256 (0 matches in registry)" },
                    { name: "Name Fuzzy Match", passed: true, score: 98, detail: "Matched Aarav Sharma with 98% similarity" },
                    { name: "Date Validity Check", passed: true, detail: "Within enrolled academic year (2025-2026)" },
                    { name: "Official Seal / QR Check", passed: true, detail: "Valid verification URL decoded via ZXing" }
                ],
                verifiedAt: "2025-12-22T14:32:00Z",
                verifiedBy: "AI Pipeline (Tess4J + Model Extractor)"
            }
        },
        {
            id: "ACT-1002",
            studentId: "USR-001",
            studentName: "Aarav Sharma",
            rollNumber: "2023CSE042",
            department: "Computer Science and Engineering",
            title: "NPTEL Elite Certificate in Deep Learning & Neural Networks",
            category: "COURSES",
            organization: "IIT Madras / SWAYAM NPTEL",
            eventDate: "2025-11-15",
            submissionDate: "2025-11-18",
            hoursSpent: 60,
            description: "12-week course covering Backpropagation, CNNs, RNNs, and Transformers. Scored 88% (Elite + Silver medal).",
            certificate: {
                fileName: "NPTEL_DeepLearning_Score88.pdf",
                fileSize: "840 KB",
                fileHash: "4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945",
                fileUrl: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&auto=format&fit=crop&q=80"
            },
            verification: {
                status: "AUTO_APPROVED",
                confidenceScore: 92,
                decision: "High Confidence Match",
                ocrExtracted: {
                    nameMatched: true,
                    extractedName: "Aarav Sharma",
                    extractedTitle: "Deep Learning - 12 Weeks Course",
                    extractedOrg: "SWAYAM - NPTEL (IIT Madras)",
                    extractedDate: "2025-11-15",
                    qrCodeUrl: "https://nptel.ac.in/noc/Ecertificate/?q=NPTEL25CS9812",
                    qrVerified: true
                },
                checks: [
                    { name: "Duplicate File Hash", passed: true, detail: "Unique SHA-256" },
                    { name: "Name Fuzzy Match", passed: true, score: 99, detail: "Exact Name Match" },
                    { name: "Date Validity Check", passed: true, detail: "Valid current academic session" },
                    { name: "QR Authority Verification", passed: true, detail: "Signed SWAYAM URL Verified" }
                ],
                verifiedAt: "2025-11-18T09:15:00Z",
                verifiedBy: "AI Pipeline"
            }
        },
        {
            id: "ACT-1003",
            studentId: "USR-001",
            studentName: "Aarav Sharma",
            rollNumber: "2023CSE042",
            department: "Computer Science and Engineering",
            title: "Inter-College Robotics Championship 2026",
            category: "TECHNICAL",
            organization: "Robotics Club, IIT Delhi",
            eventDate: "2026-02-14",
            submissionDate: "2026-02-18",
            hoursSpent: 30,
            description: "Line follower and autonomous obstacle avoidance robot challenge. Secured 2nd Runner-up.",
            certificate: {
                fileName: "IITD_Robotics_Participation.jpg",
                fileSize: "2.1 MB",
                fileHash: "98a72b3802e9cf5f9211e4f45d1ec015a9f2430b201a096c4d6a13d7890f5bca",
                fileUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80"
            },
            verification: {
                status: "PENDING_FACULTY",
                confidenceScore: 72,
                decision: "Moderate Confidence - Sent to Faculty Review Queue",
                ocrExtracted: {
                    nameMatched: true,
                    extractedName: "A. Sharma",
                    extractedTitle: "Robotics Arena IITD 2026",
                    extractedOrg: "IIT Delhi Technical Council",
                    extractedDate: "2026-02-14",
                    qrCodeUrl: null,
                    qrVerified: false
                },
                checks: [
                    { name: "Duplicate File Hash", passed: true, detail: "Unique Hash" },
                    { name: "Name Fuzzy Match", passed: false, score: 71, detail: "Abbreviated name 'A. Sharma' detected. Needs human verification." },
                    { name: "Date Validity Check", passed: true, detail: "Current term" },
                    { name: "QR / Link Verification", passed: false, detail: "No digital QR code detected on image" }
                ],
                verifiedAt: "2026-02-18T11:45:00Z",
                verifiedBy: "AI Pipeline -> Routing to Faculty Queue"
            }
        },
        {
            id: "ACT-1004",
            studentId: "USR-001",
            studentName: "Aarav Sharma",
            rollNumber: "2023CSE042",
            department: "Computer Science and Engineering",
            title: "National Blood Donation & Health Camp - NSS Volunteer",
            category: "VOLUNTEERING",
            organization: "National Service Scheme (NSS) & Red Cross Society",
            eventDate: "2026-01-26",
            submissionDate: "2026-01-28",
            hoursSpent: 16,
            description: "Coordinated donor registration, handled refreshment logistics, and managed crowd control for 450+ donors.",
            certificate: {
                fileName: "NSS_BloodDonation_Aarav.pdf",
                fileSize: "620 KB",
                fileHash: "123fbc890e0b3c21a4f02a5e89b3fcd982001923ba8e901235678abcdef01234",
                fileUrl: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800&auto=format&fit=crop&q=80"
            },
            verification: {
                status: "FACULTY_APPROVED",
                confidenceScore: 76,
                decision: "Approved by Faculty Coordinator",
                ocrExtracted: {
                    nameMatched: true,
                    extractedName: "Aarav Sharma",
                    extractedTitle: "Certificate of Social Service - Republic Day Camp",
                    extractedOrg: "National Service Scheme Unit II",
                    extractedDate: "2026-01-26",
                    qrCodeUrl: null,
                    qrVerified: false
                },
                checks: [
                    { name: "Duplicate File Hash", passed: true, detail: "Unique" },
                    { name: "Name Fuzzy Match", passed: true, score: 95, detail: "Matched Aarav Sharma" },
                    { name: "Date Validity Check", passed: true, detail: "Valid" },
                    { name: "Official Seal Stamp", passed: true, detail: "Physical seal recognized by faculty" }
                ],
                facultyReview: {
                    reviewedBy: "Dr. Priya Nair",
                    reviewedAt: "2026-01-29T16:20:00Z",
                    comments: "Verified against NSS departmental roster. Approved 16 activity credits for NAAC Criterion 3.4.3."
                }
            }
        },
        {
            id: "ACT-1005",
            studentId: "USR-004",
            studentName: "Rohan Gupta",
            rollNumber: "2023ECE019",
            department: "Electronics & Communication Engineering",
            title: "Cloud Computing Fundamentals Certificate",
            category: "COURSES",
            organization: "Coursera / AWS",
            eventDate: "2025-10-10",
            submissionDate: "2026-02-01",
            hoursSpent: 25,
            description: "Introduction to AWS EC2, S3, RDS, and IAM permissions.",
            certificate: {
                fileName: "AWS_Cloud_Certificate_Rohan.pdf",
                fileSize: "910 KB",
                fileHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", // Deliberate duplicate hash of ACT-1001 to show detection!
                fileUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80"
            },
            verification: {
                status: "DUPLICATE_FLAGGED",
                confidenceScore: 12,
                decision: "Flagged: Duplicate Certificate Hash Detected",
                ocrExtracted: {
                    nameMatched: false,
                    extractedName: "AARAV SHARMA", // File was copied from Aarav!
                    extractedTitle: "Smart India Hackathon",
                    extractedOrg: "Ministry of Education",
                    extractedDate: "2025-12-20",
                    qrCodeUrl: null,
                    qrVerified: false
                },
                checks: [
                    { name: "Duplicate SHA-256 Hash", passed: false, detail: "Collision detected with student Aarav Sharma (ACT-1001)" },
                    { name: "Identity Integrity Check", passed: false, score: 10, detail: "Name on certificate ('AARAV SHARMA') doesn't match uploader ('Rohan Gupta')" },
                    { name: "Submission Metadata", passed: false, detail: "Category mismatch: submitted as Course but content is Hackathon" }
                ],
                verifiedAt: "2026-02-01T10:05:00Z",
                verifiedBy: "AI Pipeline Integrity Engine"
            }
        },
        {
            id: "ACT-1006",
            studentId: "USR-005",
            studentName: "Ananya Deshmukh",
            rollNumber: "2023CSE088",
            department: "Computer Science and Engineering",
            title: "Summer Research Internship in Computer Vision",
            category: "INTERNSHIP",
            organization: "Center for Artificial Intelligence, DRDO",
            eventDate: "2025-07-30",
            submissionDate: "2025-08-05",
            hoursSpent: 240,
            description: "8-week internship working on edge detection algorithms and infrared sensor data processing.",
            certificate: {
                fileName: "DRDO_Internship_Completion_Ananya.pdf",
                fileSize: "1.8 MB",
                fileHash: "7b89f0291a2bc45012def89123456789abcdef01234567890abcdef123456789",
                fileUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80"
            },
            verification: {
                status: "PENDING_FACULTY",
                confidenceScore: 78,
                decision: "Moderate Confidence - Sent to Faculty Review Queue",
                ocrExtracted: {
                    nameMatched: true,
                    extractedName: "Ananya Deshmukh",
                    extractedTitle: "Research Internship Completion Certificate",
                    extractedOrg: "Defense Research and Development Org",
                    extractedDate: "2025-07-30",
                    qrCodeUrl: null,
                    qrVerified: false
                },
                checks: [
                    { name: "Duplicate File Hash", passed: true, detail: "Unique Hash" },
                    { name: "Name Fuzzy Match", passed: true, score: 96, detail: "Exact Match" },
                    { name: "Date Validity Check", passed: true, detail: "Valid summer break duration" },
                    { name: "Government Seal / Stamp", passed: true, detail: "Requires coordinator signature sign-off" }
                ],
                verifiedAt: "2025-08-05T12:00:00Z",
                verifiedBy: "AI Pipeline"
            }
        }
    ]
};

window.INITIAL_DATA = INITIAL_DATA;
