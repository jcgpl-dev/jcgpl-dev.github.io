const cvmsCaseStudy = {
  title: 'Cloud-Based Vehicle Monitoring System',
  subtitle:
    'A dual-platform Flutter application replacing manual MVPS checks at JRMSU-Katipunan Campus with enhanced AES-128 encrypted QR identification and cloud-synchronized administrative oversight.',

  sections: [
    {
      title: 'System Architecture',
      type: 'paragraphs',
      content: [
        'The system is built across two separate Flutter codebases sharing a Cloud Firestore backend. The Windows Desktop App is used by CDRRMSU administrators to register vehicles, generate Enhanced AES-128 encrypted QR codes embedded into Motor Vehicle Pass Stickers (MVPS), manage violations and sanctions, and export PDF/CSV reports. The Android Mobile App is used by security personnel at campus entry and exit points to scan MVPS stickers, decrypt the QR payload at runtime to identify the vehicle, log access events to Firestore in real time, and file violation reports — fully replacing the paper-based "No MVPS, No Entry" visual inspection.',
      ],
    },
    {
      title: 'Problem & Goal',
      type: 'notes',
      items: [
        {
          label: 'Problem',
          content:
            'JRMSU-Katipunan Campus enforces strict vehicle registration under CDRRMSU policy, requiring all vehicles to carry a physical Motor Vehicle Pass Sticker. However, the entire workflow — from registration to gate verification — was fully manual: paper logbooks, visual sticker checks by guards, and no real-time data. This created long gate queues, inconsistent enforcement, zero audit trail, and no administrative visibility into which vehicles were on campus at any given time.',
        },
        {
          label: 'Goal',
          content:
            'To digitize and secure the existing CDRRMSU vehicle policy by replacing visual sticker checks with encrypted QR scanning and paper records with a cloud-synchronized system — providing security personnel with instant mobile verification and administrators with real-time monitoring, violation management, and exportable reports; all on ordinary, resource-constrained mobile hardware.',
        },
      ],
    },
    {
      title: 'Technical Challenge & Solution',
      type: 'labeled-paragraphs',
      items: [
        {
          label: 'Challenge',
          content:
            'Standard AES-128 (10 rounds with full GF(2⁸) MixColumns) introduced unnecessary latency when encrypting and decrypting small, fixed-size Vehicle ID payloads for real-time QR gate scanning on mobile hardware. Simultaneously, MVPS stickers are physically and permanently exposed in public — any smartphone camera can scan them — making weak or plain QR encoding a direct spoofing and cloning risk.',
        },
        {
          label: 'Solution',
          content:
            'A custom EnhancedAES128 class was implemented in Dart with three targeted modifications to standard AES-128. First, rounds were reduced from 10 to 8, lowering encrypt/decrypt latency for real-time scanning. Second, a Dynamic ShiftRows mechanism derives each row\'s shift amount from the actual key bytes (key[0..2] & 0x03) instead of fixed static offsets, making the permutation key-dependent and increasing resistance to pattern-based attacks. Third, the standard GF(2⁸) MixColumns was replaced with an LFSR-inspired GF(2⁸) mixing function using XOR and xtime operations — preserving the avalanche effect and full invertibility while eliminating the costlier finite field multiplications.',
        },
      ],
      codeSnippet: `// EnhancedAES128 — core modifications (Dart)
// 1. Reduced to 8 rounds (vs. standard 10)
static const int numRounds = 8;

// 2. Dynamic ShiftRows: shift amounts from actual key bytes
void _dynamicShiftRows(Uint8List state) {
  final shifts = [0, key[0] & 0x03, key[1] & 0x03, key[2] & 0x03];
  final temp = Uint8List(16);
  for (int row = 0; row < 4; row++) {
    for (int col = 0; col < 4; col++) {
      final fromCol = (col + shifts[row]) % 4;
      temp[col * 4 + row] = state[fromCol * 4 + row];
    }
  }
  state.setAll(0, temp);
}

// 3. LFSR-inspired MixColumns: XOR + xtime (replaces GF(2^8) multiply)
void lfsrMixColumns(Uint8List state) {
  for (int col = 0; col < 4; col++) {
    final idx = col * 4;
    final b0 = state[idx], b1 = state[idx+1],
          b2 = state[idx+2], b3 = state[idx+3];
    state[idx+0] = (b0 ^ b1) & 0xFF;
    state[idx+1] = (b1 ^ b2) & 0xFF;
    state[idx+2] = (b2 ^ b3) & 0xFF;
    state[idx+3] = (b3 ^ _xtime(b0)) & 0xFF; // GF(2^8) xtime feedback
  }
}

// Inverse: uses GF(2^8) multiply with inv3 = 0xF6
void invLfsrMixColumns(Uint8List state) {
  const int inv3 = 0xF6;
  for (int col = 0; col < 4; col++) {
    final idx = col * 4;
    final b0p = state[idx], b1p = state[idx+1],
          b2p = state[idx+2], b3p = state[idx+3];
    final s   = b0p ^ b1p ^ b2p ^ b3p;
    final b0  = _gfMult(s, inv3) & 0xFF;
    state[idx+0] = b0;
    state[idx+1] = (b0p ^ b0) & 0xFF;
    state[idx+2] = (b1p ^ state[idx+1]) & 0xFF;
    state[idx+3] = (b2p ^ state[idx+2]) & 0xFF;
  }
}`,
    },
    {
      title: 'Key Features Developed',
      type: 'list',
      items: [
        'Custom EnhancedAES128 Algorithm: A purpose-built Dart implementation of modified AES-128 with 8-round reduction, key-derived Dynamic ShiftRows, and an LFSR-inspired GF(2⁸) MixColumns — balancing real-time performance with strong cryptographic security on mobile hardware.',
        'Encrypted MVPS QR Generation: Vehicle identity data is encrypted using EnhancedAES128 on the desktop and embedded into QR codes printed on Motor Vehicle Pass Stickers — raw sticker content is unreadable outside the system.',
        'Mobile QR Scanner & Access Logging: Security personnel scan MVPS stickers at campus gates; the app decrypts the payload, identifies the vehicle, logs the access event to Firestore in real time, and plays audio scan feedback.',
        'Violation Reporting: Security personnel file violations directly from a scan result on mobile; CDRRMSU admins review, manage sanctions, and maintain the full violation history on the desktop portal.',
        'Admin Portal — Records & Reports: Administrators manage vehicle registrations with Philippine province/barangay data support, monitor real-time onsite/offsite vehicle status via Firestore listeners, and export PDF/CSV reports powered by Syncfusion DataGrid and Charts.',
      ],
    },
  ],
};

export const projects = [
  {
    title: 'Cloud-based Vehicle Monitoring System - Desktop App',
    description: 'A Flutter-based vehicle monitoring system using QR codes and Firebase Firestore for real-time tracking and AES-encrypted payloads designed for JRMSU - KC CDRRMSU.',
    image: 'assets/images/projects/cvms/cover.png',
    images: [

      'assets/images/projects/cvms/login.png',
      'assets/images/projects/cvms/register.png',
      'assets/images/projects/cvms/forgot_pass.png',
      'assets/images/projects/cvms/email_sent.png',


      'assets/images/projects/cvms/dashboard.png',
      'assets/images/projects/cvms/dashboard_light.png',
      'assets/images/projects/cvms/dashboard_light_sidebar_collapsed.png',
      'assets/images/projects/cvms/dashboard_scrolled.png',
      'assets/images/projects/cvms/individual_vehicle_dashboard.png',
      'assets/images/projects/cvms/custom_date_reporting.png',
      'assets/images/projects/cvms/pdf_report_preview.png',
      'assets/images/projects/cvms/vehicle_by_college.png',
      'assets/images/projects/cvms/vehicle_by_year_level.png',
      'assets/images/projects/cvms/students_by_violation_share.png',



      'assets/images/projects/cvms/vehicle_monitoring.png',
      'assets/images/projects/cvms/monitoring_vehicle_info.png',
      'assets/images/projects/cvms/vehicle_logs.png',
      'assets/images/projects/cvms/vehicle_logs_bulk_mode.png',



      'assets/images/projects/cvms/vehicle_management.png',
      'assets/images/projects/cvms/mvp_preview.png',
      'assets/images/projects/cvms/vehicle_info.png',
      'assets/images/projects/cvms/edit_vehicle_info.png',
      'assets/images/projects/cvms/expiring_vehicles.png',

      'assets/images/projects/cvms/violation_management.png',
      'assets/images/projects/cvms/violation_empty_state.png',
      'assets/images/projects/cvms/sanction_management.png',


      'assets/images/projects/cvms/user_management.png',
      'assets/images/projects/cvms/add_user.png',
      'assets/images/projects/cvms/edit_user.png',
      'assets/images/projects/cvms/activity_logs.png',
      'assets/images/projects/cvms/activity_details.png',


      'assets/images/projects/cvms/profile.png',
      'assets/images/projects/cvms/settings.png',

      'assets/images/projects/cvms/pdf_report_branding.png',

      'assets/images/projects/cvms/custom_login_background_image.png',
      'assets/images/projects/cvms/login_custom_bg_image.png',

      'assets/images/projects/cvms/custom_sidebar_theme.png',
      'assets/images/projects/cvms/logout.png',
    ],
    techStack: ['Flutter', 'Dart', 'Firebase Auth', 'Cloud Firestore', 'Bloc', 'AES'],
    caseStudy: cvmsCaseStudy,
    githubUrl: null,
    liveUrl: null,
  },
  {
    title: 'Cloud-based Vehicle Monitoring System - Mobile App',
    description: 'A Flutter-based vehicle monitoring system using QR codes and Firebase Firestore for real-time tracking and AES-encrypted payloads designed for JRMSU - KC CDRRMSU.',
    image: 'assets/images/projects/cvms/mobile/cover.png',
    images: [
      'assets/images/projects/cvms/mobile/splash.png',
      'assets/images/projects/cvms/mobile/login.png',
      'assets/images/projects/cvms/mobile/home.png',
      'assets/images/projects/cvms/mobile/profile.png',
      'assets/images/projects/cvms/mobile/about.png',
      'assets/images/projects/cvms/mobile/scan_entry.png',
      'assets/images/projects/cvms/mobile/entry_decision.png',
      'assets/images/projects/cvms/mobile/exit_scan.png',
      'assets/images/projects/cvms/mobile/vehicle_scan.png',
      'assets/images/projects/cvms/mobile/vehicle_info.png',
      'assets/images/projects/cvms/mobile/vehicle_info_scrolled.png',
      'assets/images/projects/cvms/mobile/report_modal.png',
      'assets/images/projects/cvms/mobile/choose_violation.png',
      'assets/images/projects/cvms/mobile/activities.png',
      'assets/images/projects/cvms/mobile/drawer.png',

    ],
    techStack: ['Flutter', 'Dart', 'Firebase Auth', 'Cloud Firestore', 'Bloc', 'AES'],
    caseStudy: cvmsCaseStudy,
    githubUrl: null,
    liveUrl: null,
  },
  {
    title: 'JRMSU CCS Dean\'s Office Visitors Log System - Mobile App',
    description: 'A QR-based visitor registration and log system for JRMSU CCS, built with Flutter and Firebase for real-time visitor tracking.',
    image: 'assets/images/projects/cvls/mobile/mobile-cover.png',
    images: [
      'assets/images/projects/cvls/mobile/splash.png',
      'assets/images/projects/cvls/mobile/sign-up.png',
      'assets/images/projects/cvls/mobile/login.png',
      'assets/images/projects/cvls/mobile/forgot-pass.png',
      'assets/images/projects/cvls/mobile/home-open.png',
      'assets/images/projects/cvls/mobile/sched.png',
      'assets/images/projects/cvls/mobile/visit-purpose.png',
      'assets/images/projects/cvls/mobile/scan.png',
      'assets/images/projects/cvls/mobile/drawer.png',
      'assets/images/projects/cvls/mobile/about.png',
      'assets/images/projects/cvls/mobile/info.png',
      'assets/images/projects/cvls/mobile/logout.png',
    ],
    techStack: ['Flutter', 'Dart', 'Firebase'],
    githubUrl: null,
    liveUrl: null,
  },
  {
    title: 'JRMSU CCS Dean\'s Office Visitors Log System - Desktop App',
    description: 'A QR-based visitor registration and log system for JRMSU CCS, built with Flutter and Firebase for real-time visitor tracking.',
    image: 'assets/images/projects/cvls/cover.png',
    images: [

      'assets/images/projects/cvls/login.png',
      'assets/images/projects/cvls/dashboard.png',
      'assets/images/projects/cvls/manual_add_visitor.png',

      'assets/images/projects/cvls/visitors_log.png',
      'assets/images/projects/cvls/visitors_log_date_filter.png',
      'assets/images/projects/cvls/visitor_empty_search_result.png',
      'assets/images/projects/cvls/add_visitor.png',

      'assets/images/projects/cvls/edit_visitor.png',
      'assets/images/projects/cvls/delete_visitor.png',
      'assets/images/projects/cvls/pdf_report_preview.png',
      'assets/images/projects/cvls/analytics_report.png',
      'assets/images/projects/cvls/qr_code_management.png',
      'assets/images/projects/cvls/qr_codes.png',
      'assets/images/projects/cvls/office_hours.png',
      'assets/images/projects/cvls/settings.png',

      'assets/images/projects/cvls/logout.png',
    ],
    techStack: ['Flutter', 'Dart', 'Firebase'],
    githubUrl: null,
    liveUrl: null,
  },
  {
    title: 'Gapz Graphics Portfolio Website',
    description: 'A personal graphic design portfolio website showcasing branding and visual design work.',
    image: 'assets/images/projects/portfolio/gapz_graphix.png',
    images: [
      'assets/images/projects/portfolio/gapz_graphix1.png',
      'assets/images/projects/portfolio/gapz_graphix.png',
      'assets/images/projects/portfolio/gapz_graphix2.png',
      'assets/images/projects/portfolio/gapz_graphix3.png',
      'assets/images/projects/portfolio/gapz_graphix4.png',
    ],
    techStack: ['HTML', 'CSS', 'JavaScript'],
    githubUrl: null,
    liveUrl: 'https://jesiegapol23.github.io/gapzgraphix',
  },
  {
    title: 'Records Management System - Desktop App',
    description: 'Contributed and assisted the development of an offline support records management system for JRMSU - Records Office during On-JOb-Training (OJT) days.',
    image: 'assets/images/projects/records/login.png',
    images: [
      'assets/images/projects/records/login.png',
      'assets/images/projects/records/signup.png',
      'assets/images/projects/records/dashboard.png',
      'assets/images/projects/records/add.png',
      'assets/images/projects/records/edit.png',
      'assets/images/projects/records/receive.png',
      'assets/images/projects/records/release.png',
      'assets/images/projects/records/send.png',
      'assets/images/projects/records/add.png',
      'assets/images/projects/records/delete.png',
      'assets/images/projects/records/docs.png',
      'assets/images/projects/records/report_and_analytics.png',

      'assets/images/projects/records/report.png',
      'assets/images/projects/records/activity.png',
      'assets/images/projects/records/profile.png',
      'assets/images/projects/records/about.png',
    ],
    techStack: ['Flutter', 'Dart', 'SQLite'],
    githubUrl: null,
    liveUrl: null,
  },

  {
    title: 'Messenger Clone',
    description: 'A modern messaging app UI/UX case study inspired by Messenger, featuring onboarding flows, customizable chat themes, authentication screens, notifications, and interactive chat interfaces built with Flutter.',
    image: 'assets/images/projects/messenger-clone/cover.png',
    images: [
      'assets/images/projects/messenger-clone/login.png',

      'assets/images/projects/messenger-clone/onboarding-1.png',
      'assets/images/projects/messenger-clone/find_acc.png',
      'assets/images/projects/messenger-clone/name.png',
      'assets/images/projects/messenger-clone/user_name.png',
      'assets/images/projects/messenger-clone/gender.png',
      'assets/images/projects/messenger-clone/b-day.png',
      'assets/images/projects/messenger-clone/birthday.png',
      'assets/images/projects/messenger-clone/email.png',
      'assets/images/projects/messenger-clone/password.png',
      'assets/images/projects/messenger-clone/terms.png',
      'assets/images/projects/messenger-clone/chats.png',
      'assets/images/projects/messenger-clone/cool-crew-theme.png',
      'assets/images/projects/messenger-clone/avatar-theme.png',
      'assets/images/projects/messenger-clone/theme-selection.png',
      'assets/images/projects/messenger-clone/quick-reactions.png',

      'assets/images/projects/messenger-clone/chat-info.png',
      'assets/images/projects/messenger-clone/stories.png',
      'assets/images/projects/messenger-clone/notifs.png',
      'assets/images/projects/messenger-clone/menu.png',
      'assets/images/projects/messenger-clone/update_acc.png',
    ],
    techStack: ['Flutter', 'Dart', 'Firebase'],
    githubUrl: null,
    liveUrl: null,
  },

  {
    title: 'Storemate - Mobile App',
    description: 'StoreMate is a companion app designed for small shops and convenience stores.',
    image: 'assets/images/projects/store_mate/dashboard_cover.png',
    images: [
      // 1. App Startup & Authentication
      'assets/images/projects/store_mate/splash.png',
      'assets/images/projects/store_mate/login.png',
      'assets/images/projects/store_mate/register.png',
      'assets/images/projects/store_mate/forgot_password.png',
      'assets/images/projects/store_mate/email_sent.png',

      // 2. Core Hub / Dashboard
      'assets/images/projects/store_mate/dashboard.png',
      'assets/images/projects/store_mate/best_selling_items.png',
      'assets/images/projects/store_mate/sales.png',

      // 3. Products Management
      'assets/images/projects/store_mate/products.png',
      'assets/images/projects/store_mate/product_details.png',
      'assets/images/projects/store_mate/add_product.png',
      'assets/images/projects/store_mate/edit_product.png',
      'assets/images/projects/store_mate/restock.png',

      // 4. Cart & Checkout Workflow
      'assets/images/projects/store_mate/cart_selection.png',
      'assets/images/projects/store_mate/cart.png',
      'assets/images/projects/store_mate/add_cart.png',
      'assets/images/projects/store_mate/confirm_checkout.png',
      'assets/images/projects/store_mate/check_out_receipt.png',

      // 5. Customers Management
      'assets/images/projects/store_mate/customers.png',
      'assets/images/projects/store_mate/add_customer.png',
      'assets/images/projects/store_mate/edit_customer.png',

      // 6. Expenses Management
      'assets/images/projects/store_mate/expenses.png',
      'assets/images/projects/store_mate/expense_details.png',
      'assets/images/projects/store_mate/add_expense.png',

      // 7. Profile, Settings & App Info
      'assets/images/projects/store_mate/profile.png',
      'assets/images/projects/store_mate/edit_profile.png',
      'assets/images/projects/store_mate/about.png',
      'assets/images/projects/store_mate/date_picker.png',
    ],
    techStack: ['Kotlin', 'XML', 'Firebase'],
    githubUrl: 'https://github.com/jcgpl-dev/StoreMate',
    liveUrl: null,
  },
  {
    title: 'Peso Path - Budgeting App',
    description: 'Peso Path is an offline-first personal budgeting and expense tracking mobile application built with Flutter. It helps users manage their finances by tracking expenses, monitoring budgets, setting savings goals, and calculating a safe daily spending limit based on available funds.',
    image: 'assets/images/projects/peso_path/cover2.png',
   images: [
  // 1. App Startup & Authentication
  'assets/images/projects/peso_path/splash.png',
  'assets/images/projects/peso_path/login.png',
  'assets/images/projects/peso_path/register.png',

  // 2. Core Dashboard & Setup
     'assets/images/projects/peso_path/home.png',
     'assets/images/projects/peso_path/home-dark.png',
    'assets/images/projects/peso_path/transactions.png',
  'assets/images/projects/peso_path/buget_setup.png',
  'assets/images/projects/peso_path/budget_edit.png',

  // 3. Transactions & Management
     'assets/images/projects/peso_path/add_expense.png',
    'assets/images/projects/peso_path/add_income.png',
  'assets/images/projects/peso_path/edit_transaction.png',
  


  // 4. Savings & Goals
  'assets/images/projects/peso_path/savings_goal.png',
  'assets/images/projects/peso_path/add_goal.png',
  'assets/images/projects/peso_path/add_deposit.png',

  // 5. User Profile & Settings
     'assets/images/projects/peso_path/profile.png',
  'assets/images/projects/peso_path/switch-profile.png',
  'assets/images/projects/peso_path/settings.png',
  'assets/images/projects/peso_path/about_us.png',
  'assets/images/projects/peso_path/about_dev.png'
],
    techStack: ['Flutter', 'Dart', 'SQLite'],
    githubUrl: 'https://github.com/jcgpl-dev/peso_path',
    liveUrl: 'https://drive.google.com/file/d/1qY517xcxQoaWD-Gcky_Yl61gXMAPXkCy/view?usp=drive_link',
  },
  {
    title: 'SharpTube: Desktop Media Downloader',
    description: 'An architectural-focused desktop application built with Flutter and the BLoC pattern. It delivers real-time asset extraction by bridging yt-dlp pipelines with high-fidelity performance metrics, custom OS-level native title bar bindings, a fully adaptive fluid sidebar layout, and an offline-first download tracking queue.',
    image: 'assets/images/projects/yt-dl/cover.png',
    images: [
      // 1. App Startup & Authentication
      'assets/images/projects/yt-dl/ss1.png',
      'assets/images/projects/yt-dl/ss2.png',
      'assets/images/projects/yt-dl/ss3.png',
    ],
    techStack: ['Flutter', 'Dart', 'BLoC', 'yt-dlp'],
    githubUrl: 'https://github.com/jcgpl-dev/youtube_downloader',
    liveUrl: 'https://drive.google.com/drive/folders/1gkqwAKRnJAejgW-3q_XKyofC3QfeQDm6?usp=drive_link',
  },
  {
    title: 'Tarpaulin Design',
    description: 'Designed Tarpaulin layouts using adobe photoshop.',
    image: 'assets/images/projects/graphics/tarp-design.png',
    images: [
      'assets/images/projects/graphics/tarp-design.png',

    ],
    techStack: ['Adobe Photoshop'],
    githubUrl: null,
    liveUrl: null,
  },
  // {
  //   title:       'JRMSU K Sports Fest 2026 — CCS Basketball Jersey Design',
  //   description: 'Basketball Jersey Design for JRMSU - KC CCS during Sports Fest 2026.',
  //   image:       'assets/images/projects/graphics/design3.png',
  //   images:      [
  //     'assets/images/projects/graphics/design1.png',
  //     'assets/images/projects/graphics/design2.png',
  //     'assets/images/projects/graphics/design3.png',
  //   ],
  //   techStack:   ['Adobe Photoshop', 'Adobe Illustrator'],
  //   githubUrl:   null,
  //   liveUrl:     null,
  // },
  {
    title: 'JRMSU K Sports Fest 2026 — Shirt Design I',
    description: 'Shirt design contribution for JRMSU K Sports Fest 2026, created using Adobe Photoshop and Illustrator.',
    image: 'assets/images/projects/graphics/design1.png',
    images: [
      'assets/images/projects/graphics/design1.png',
      'assets/images/projects/graphics/design2.png',
      'assets/images/projects/graphics/design3.png',
    ],
    techStack: ['Adobe Photoshop', 'Adobe Illustrator'],
    githubUrl: null,
    liveUrl: null,
  },
  {
    title: 'Storemate Figma Design',
    description: 'A comprehensive UI/UX design for a modern retail and inventory management ecosystem, focusing on user workflows, clean data presentation, and intuitive navigation for a mobile application tailored to small business needs.',
    image: 'assets/images/projects/figma_design_storemate/cover.png',
    images: [
      'assets/images/projects/figma_design_storemate/cover.png',
    ],
    techStack: ['Figma'],
    githubUrl: null,
    liveUrl: null,
  },
  {
    title: 'CVMS Figma Design',
    description: 'A high-fidelity dashboard and tracking system interface designed for a Cloud-based Vehicle Monitoring System (CVMS), emphasizing administrative control and accessible UX.',
    image: 'assets/images/projects/figma_design_cvms/cover.png',
    images: [
      'assets/images/projects/figma_design_cvms/cover.png', // Fixed directory typo here
    ],
    techStack: ['Figma'],
    githubUrl: null,
    liveUrl: null,
  },
];
