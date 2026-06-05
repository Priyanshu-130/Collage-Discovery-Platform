export interface Course {
    name: string;
    duration: string;
    fees: number;
    placementRate: number;
}
export interface CollegePlacement {
    averagePackage: number;
    highestPackage: number;
    placementRate: number;
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
    logo: string;
    image: string;
    rating: number;
    reviewsCount: number;
    location: string;
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
    minNirf: number;
    exam: string;
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
