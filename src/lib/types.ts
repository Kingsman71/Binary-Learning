export type ProgramCategory = 'Web Development' | 'Data Science' | 'UI/UX Design' | 'Cybersecurity';

export interface Program {
  id: string;
  title: string;
  category: ProgramCategory;
  duration: string; // e.g., "12 Weeks"
  startDate: Date;
  description: string;
  instructor: {
    name: string;
    bio: string;
    avatarUrl: string;
  };
  curriculum: {
    module: number;
    title: string;
    content: string;
  }[];
}

export type ApplicationStatus = 'Pending Review' | 'Approved' | 'Denied';

export interface Application {
  id: string;
  applicant: {
    fullName: string;
    email: string;
    phone: string;
  };
  programId: string;
  programTitle: string;
  applicationDate: Date;
  status: ApplicationStatus;
  education: {
    highestQualification: string;
    fieldOfStudy: string;
    institution: string;
  };
  statementOfPurpose: string;
}
