import type { Application } from './types';

export const applications: Application[] = [
  {
    id: 'app-001',
    applicant: {
      fullName: 'Alice Johnson',
      email: 'alice.j@example.com',
      phone: '123-456-7890',
    },
    programId: 'full-stack-odyssey',
    programTitle: 'Full-Stack Odyssey',
    applicationDate: new Date('2024-07-20'),
    status: 'Pending Review',
    education: {
      highestQualification: 'Bachelor of Science',
      fieldOfStudy: 'Information Technology',
      institution: 'State University',
    },
    statementOfPurpose: 'I am passionate about building full-stack applications and believe this program is the perfect next step in my career. I have experience with JavaScript and am eager to learn more about React and Node.js.',
  },
  {
    id: 'app-002',
    applicant: {
      fullName: 'Bob Williams',
      email: 'bob.w@example.com',
      phone: '234-567-8901',
    },
    programId: 'data-driven-decisions',
    programTitle: 'Data-Driven Decisions',
    applicationDate: new Date('2024-07-22'),
    status: 'Pending Review',
    education: {
      highestQualification: 'Master of Arts',
      fieldOfStudy: 'Economics',
      institution: 'Economics Institute',
    },
    statementOfPurpose: 'My goal is to transition into a data science role where I can apply my analytical skills. This program\'s curriculum perfectly aligns with my learning objectives, especially the modules on machine learning.',
  },
  {
    id: 'app-003',
    applicant: {
      fullName: 'Charlie Brown',
      email: 'charlie.b@example.com',
      phone: '345-678-9012',
    },
    programId: 'pixel-perfect-interfaces',
    programTitle: 'Pixel-Perfect Interfaces',
    applicationDate: new Date('2024-07-18'),
    status: 'Approved',
    education: {
      highestQualification: 'Associate Degree',
      fieldOfStudy: 'Graphic Design',
      institution: 'Community College of Design',
    },
    statementOfPurpose: 'With a background in graphic design, I want to specialize in UI/UX to create more user-centric digital products. I am excited to learn about user research and prototyping.',
  },
    {
    id: 'app-004',
    applicant: {
      fullName: 'Diana Prince',
      email: 'diana.p@example.com',
      phone: '456-789-0123',
    },
    programId: 'digital-fortress',
    programTitle: 'The Digital Fortress',
    applicationDate: new Date('2024-07-25'),
    status: 'Denied',
    education: {
      highestQualification: 'High School Diploma',
      fieldOfStudy: 'General Studies',
      institution: 'Central High',
    },
    statementOfPurpose: 'Cybersecurity seems like a really cool and important field and I want to see if it is a good fit for me.',
  },
];
