export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
}

export interface TestDomain {
  id: string;
  title: string;
  description: string;
  passingScore: number; // percentage
  durationMinutes: number;
  questions: Question[];
}

export const questionBank: TestDomain[] = [
  {
    id: 'civic-law',
    title: 'Civic Law & Constitution',
    description: 'Fundamental rights, constitutional provisions, and civic duties of Pakistani citizens.',
    passingScore: 70,
    durationMinutes: 20,
    questions: [
      {
        id: 'cl-1',
        text: 'How many articles does the Constitution of Pakistan (1973) originally contain?',
        options: ['206', '280', '230', '260'],
        correctIndex: 1,
      },
      {
        id: 'cl-2',
        text: 'Which fundamental right guarantees freedom of movement within Pakistan?',
        options: ['Article 9', 'Article 15', 'Article 19', 'Article 25'],
        correctIndex: 1,
      },
      {
        id: 'cl-3',
        text: 'The National Assembly of Pakistan consists of how many seats?',
        options: ['272', '342', '336', '350'],
        correctIndex: 1,
      },
      {
        id: 'cl-4',
        text: 'Which institution is the guardian of the Constitution of Pakistan?',
        options: ['Parliament', 'Prime Minister Office', 'Supreme Court', 'President'],
        correctIndex: 2,
      },
      {
        id: 'cl-5',
        text: 'What is the minimum age to vote in Pakistani general elections?',
        options: ['16', '18', '21', '25'],
        correctIndex: 1,
      },
      {
        id: 'cl-6',
        text: 'Article 25-A of the Constitution relates to:',
        options: ['Right to property', 'Free and compulsory education', 'Freedom of speech', 'Right to information'],
        correctIndex: 1,
      },
      {
        id: 'cl-7',
        text: 'The Federal Shariat Court was established under which constitutional amendment?',
        options: ['7th', '8th', '18th', '21st'],
        correctIndex: 0,
      },
      {
        id: 'cl-8',
        text: 'Which article of the Constitution deals with the independence of the judiciary?',
        options: ['Article 2A', 'Article 175A', 'Article 184', 'Article 209'],
        correctIndex: 1,
      },
      {
        id: 'cl-9',
        text: 'The 18th Amendment transferred many subjects from the Federal to:',
        options: ['District governments', 'Provincial governments', 'Senate', 'Judiciary'],
        correctIndex: 1,
      },
      {
        id: 'cl-10',
        text: 'Writ of Habeas Corpus can be filed in:',
        options: ['Sessions Court only', 'High Court or Supreme Court', 'District Court only', 'Magistrate Court'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'digital-governance',
    title: 'Digital Governance & E-Services',
    description: 'Government e-services, digital identity, data protection and cyber governance frameworks.',
    passingScore: 65,
    durationMinutes: 20,
    questions: [
      {
        id: 'dg-1',
        text: 'NADRA stands for:',
        options: [
          'National Agency for Digital Records Administration',
          'National Database & Registration Authority',
          'National Digital Records & Authentication',
          'National Department of Records & Attestation',
        ],
        correctIndex: 1,
      },
      {
        id: 'dg-2',
        text: 'Which Act governs electronic transactions in Pakistan?',
        options: ['IT Act 2000', 'Electronic Transactions Ordinance 2002', 'Cyber Crime Act 2016', 'Data Protection Act 2023'],
        correctIndex: 1,
      },
      {
        id: 'dg-3',
        text: 'Pakistan Electronic Media Regulatory Authority (PEMRA) regulates:',
        options: ['Internet services', 'Electronic broadcast media', 'Telecom companies', 'Software companies'],
        correctIndex: 1,
      },
      {
        id: 'dg-4',
        text: 'The Prevention of Electronic Crimes Act (PECA) was enacted in:',
        options: ['2002', '2010', '2016', '2020'],
        correctIndex: 2,
      },
      {
        id: 'dg-5',
        text: 'Pakistan\'s National Cyber Security Policy was launched in:',
        options: ['2014', '2018', '2021', '2023'],
        correctIndex: 2,
      },
      {
        id: 'dg-6',
        text: 'The "Digital Pakistan" vision aims primarily to:',
        options: [
          'Replace all civil servants with AI',
          'Increase smartphone manufacturing',
          'Enable digital economy and e-governance for all citizens',
          'Privatize all government services',
        ],
        correctIndex: 2,
      },
      {
        id: 'dg-7',
        text: 'What is the purpose of the Pakistan Single Window (PSW)?',
        options: [
          'A national portal for citizen complaints',
          'Unified platform for trade facilitation and customs',
          'Digital ID issuance system',
          'Online tax filing portal',
        ],
        correctIndex: 1,
      },
      {
        id: 'dg-8',
        text: 'FBR\'s IRIS portal is used for:',
        options: ['Identity registration', 'Income tax returns filing', 'Border control', 'Land records'],
        correctIndex: 1,
      },
      {
        id: 'dg-9',
        text: 'Which body regulates telecom services in Pakistan?',
        options: ['PEMRA', 'PTA', 'SECP', 'NTISB'],
        correctIndex: 1,
      },
      {
        id: 'dg-10',
        text: 'Blockchain-based land records were first piloted in Pakistan in which province?',
        options: ['Sindh', 'KPK', 'Punjab', 'Balochistan'],
        correctIndex: 2,
      },
    ],
  },
  {
    id: 'public-finance',
    title: 'Public Finance & Taxation',
    description: 'Government budgeting, fiscal policy, tax structure and public expenditure management.',
    passingScore: 70,
    durationMinutes: 25,
    questions: [
      {
        id: 'pf-1',
        text: 'The Federal Budget of Pakistan is presented in:',
        options: ['National Assembly', 'Senate', 'Joint Session', 'Cabinet'],
        correctIndex: 0,
      },
      {
        id: 'pf-2',
        text: 'FBR stands for:',
        options: ['Federal Budget Revenue', 'Federal Board of Revenue', 'Finance Bureau of Revenue', 'Fiscal Balance Reporting'],
        correctIndex: 1,
      },
      {
        id: 'pf-3',
        text: 'GST in Pakistan is currently levied at what standard rate?',
        options: ['15%', '17%', '18%', '20%'],
        correctIndex: 1,
      },
      {
        id: 'pf-4',
        text: 'The Auditor General of Pakistan audits:',
        options: ['Only federal government accounts', 'Federal and provincial government accounts', 'Only provincial accounts', 'Private sector companies'],
        correctIndex: 1,
      },
      {
        id: 'pf-5',
        text: 'NFC Award distributes revenue between:',
        options: ['Federal and provincial governments', 'Provinces only', 'Federal government only', 'Districts'],
        correctIndex: 0,
      },
      {
        id: 'pf-6',
        text: 'PSDP stands for:',
        options: [
          'Pakistan Social Development Programme',
          'Public Sector Development Programme',
          'Provincial Savings & Development Plan',
          'Primary Sector Development Policy',
        ],
        correctIndex: 1,
      },
      {
        id: 'pf-7',
        text: 'Which tax is a direct tax in Pakistan?',
        options: ['GST', 'Customs Duty', 'Income Tax', 'Sales Tax on Services'],
        correctIndex: 2,
      },
      {
        id: 'pf-8',
        text: 'Withholding tax is collected by:',
        options: ['The taxpayer themselves', 'The payer on behalf of FBR', 'Provincial tax authorities', 'SBP'],
        correctIndex: 1,
      },
      {
        id: 'pf-9',
        text: 'State Bank of Pakistan (SBP) primarily controls:',
        options: ['Fiscal policy', 'Monetary policy', 'Trade policy', 'Industrial policy'],
        correctIndex: 1,
      },
      {
        id: 'pf-10',
        text: 'Article 78 of the Constitution establishes:',
        options: ['National Finance Commission', 'Federal Consolidated Fund', 'Auditor General office', 'Federal Public Service Commission'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'admin-management',
    title: 'Public Administration & Management',
    description: 'Civil service structure, administrative law, human resource management in government.',
    passingScore: 65,
    durationMinutes: 20,
    questions: [
      {
        id: 'am-1',
        text: 'The Federal Public Service Commission (FPSC) conducts:',
        options: ['Provincial civil service exams', 'CSS exam for federal bureaucracy', 'Judicial exams', 'Military officer exams'],
        correctIndex: 1,
      },
      {
        id: 'am-2',
        text: 'CSS stands for:',
        options: ['Civil Superior Services', 'Central Superior Services', 'Combined Superior Services', 'Competitive Superior Services'],
        correctIndex: 2,
      },
      {
        id: 'am-3',
        text: 'Establishment Division is responsible for:',
        options: ['Budget preparation', 'Civil service personnel management', 'Foreign affairs', 'Revenue collection'],
        correctIndex: 1,
      },
      {
        id: 'am-4',
        text: 'An Administrative Tribunal in Pakistan handles:',
        options: ['Criminal cases', 'Civil service employment disputes', 'Tax disputes', 'Commercial disputes'],
        correctIndex: 1,
      },
      {
        id: 'am-5',
        text: 'The principle of "Rule of Law" means:',
        options: ['Government can make any rules', 'All persons and institutions are subject to and accountable to law', 'Only courts can make laws', 'Military controls the law'],
        correctIndex: 1,
      },
      {
        id: 'am-6',
        text: 'District Management Group (DMG) was renamed to:',
        options: ['PAS (Pakistan Administrative Service)', 'PCS', 'BPS-17 cadre', 'Revenue Service'],
        correctIndex: 0,
      },
      {
        id: 'am-7',
        text: 'Performance Evaluation Reports (PERs) in civil service are:',
        options: ['Annual reports of citizen complaints', 'Annual confidential reports on officer performance', 'Budget utilization reports', 'Public audit findings'],
        correctIndex: 1,
      },
      {
        id: 'am-8',
        text: 'The ombudsman institution in Pakistan is called:',
        options: ['Anti-Corruption Establishment', 'Wafaqi Mohtasib', 'NAB', 'FIA'],
        correctIndex: 1,
      },
      {
        id: 'am-9',
        text: 'Good governance is characterized by:',
        options: [
          'Secrecy and speed',
          'Accountability, transparency, rule of law and participation',
          'Centralization of power',
          'Military oversight',
        ],
        correctIndex: 1,
      },
      {
        id: 'am-10',
        text: 'National Accountability Bureau (NAB) was established under:',
        options: ['NAO 1999', 'Anti-Corruption Act 1947', 'PECA 2016', 'Companies Act 2017'],
        correctIndex: 0,
      },
    ],
  },
  {
    id: 'health-safety',
    title: 'Public Health & Safety Regulations',
    description: 'Health policy, occupational safety standards, environmental regulations and public welfare.',
    passingScore: 65,
    durationMinutes: 20,
    questions: [
      {
        id: 'hs-1',
        text: 'The Pakistan Environmental Protection Act was enacted in:',
        options: ['1983', '1997', '2002', '2010'],
        correctIndex: 1,
      },
      {
        id: 'hs-2',
        text: 'NEQS stands for:',
        options: ['National Environmental Quality Standards', 'National Emergency & Quality Services', 'Natural Environment Quality Surveys', 'National Effluent Quality System'],
        correctIndex: 0,
      },
      {
        id: 'hs-3',
        text: 'Occupational health and safety in Pakistan is governed by:',
        options: ['Companies Act 2017', 'Factories Act 1934', 'Labour Policy 2010', 'Industrial Relations Act'],
        correctIndex: 1,
      },
      {
        id: 'hs-4',
        text: 'WHO is headquartered in:',
        options: ['New York', 'London', 'Geneva', 'Brussels'],
        correctIndex: 2,
      },
      {
        id: 'hs-5',
        text: 'The Expanded Programme on Immunization (EPI) in Pakistan covers how many antigens?',
        options: ['5', '8', '11', '14'],
        correctIndex: 2,
      },
      {
        id: 'hs-6',
        text: 'Environmental Impact Assessment (EIA) is mandatory for:',
        options: ['All business activities', 'Only industrial projects', 'Projects likely to cause significant environmental effects', 'Agricultural projects only'],
        correctIndex: 2,
      },
      {
        id: 'hs-7',
        text: 'DRAP stands for:',
        options: [
          'Drug Regulation and Approval Policy',
          'Drug Regulatory Authority of Pakistan',
          'Department of Registration and Approval',
          'Directorate of Research on Allied Products',
        ],
        correctIndex: 1,
      },
      {
        id: 'hs-8',
        text: 'First aid obligation at industrial workplaces in Pakistan requires:',
        options: ['A hospital on-site', 'A first aid box per 150 workers', 'A certified doctor per 50 workers', 'Emergency fund only'],
        correctIndex: 1,
      },
      {
        id: 'hs-9',
        text: 'Universal Health Coverage (UHC) aims to ensure:',
        options: [
          'Free medicines for all',
          'All people can access quality health services without financial hardship',
          'Privatization of health services',
          'Only emergency care is free',
        ],
        correctIndex: 1,
      },
      {
        id: 'hs-10',
        text: 'Pakistan\'s Sehat Sahulat Programme provides health coverage for:',
        options: ['Government employees only', 'Low-income families enrolled in BISP', 'Urban population only', 'Military families'],
        correctIndex: 1,
      },
    ],
  },
];

export function getDomainById(id: string): TestDomain | undefined {
  return questionBank.find((d) => d.id === id);
}
