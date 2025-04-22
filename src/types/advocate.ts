export interface Advocate {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    specialties: string[];
    bio?: string;
    city: string;
    degree: string;
    yearsOfExperience: number;
    location?: string;
    phoneNumber: string;
    languagesSpoken?: string[];
    available?: boolean;
    createdAt?: string; // ISO date string
    updatedAt?: string; // ISO date string
  }
  