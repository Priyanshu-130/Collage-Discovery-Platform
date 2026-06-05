export interface Course {
  name: string;
  duration: string;
  fees: number; // Annual fee in INR
  placementRate: number; // Percentage
}

export interface CollegePlacement {
  averagePackage: number; // in LPA
  highestPackage: number; // in LPA
  placementRate: number; // percentage
  topRecruiters: string[];
}

export interface CollegeFeesRange {
  min: number;
  max: number;
}

export interface College {
  id: string;
  name: string;
  shortName: string;
  logo: string; // fallback initials or icon
  image: string; // Banner cover image
  rating: number; // e.g., 4.7
  reviewsCount: number;
  location: string; // e.g., "Bangalore, Karnataka"
  city: string;
  state: string;
  type: 'Public' | 'Private';
  founded: number;
  description: string;
  feesRange: CollegeFeesRange;
  placement: CollegePlacement;
  courses: Course[];
  facilities: string[];
  studentFacultyRatio: string;
  campusSize: string;
  accreditation: string;
  nirfRank?: number;
  acceptedExams: string[];
  subRatings: {
    academics: number;
    placements: number;
    infra: number;
    campusLife: number;
  };
}

export interface FilterState {
  search: string;
  city: string;
  course: string;
  type: string;
  maxFees: number;
  minRating: number;
  minNirf: number; // 0 = All, 10 = Top 10, 50 = Top 50, 100 = Top 100
  exam: string; // accepted exam name (e.g. "JEE Main")
  sortBy: 'rating' | 'fees' | 'placement';
  sortOrder: 'asc' | 'desc';
}

export interface User {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
}

export interface SavedComparison {
  id: string;
  name: string;
  collegeIds: string[];
  timestamp: string;
}

