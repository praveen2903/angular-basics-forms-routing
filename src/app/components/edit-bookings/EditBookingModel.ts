export interface BookingModel {
    id:number;
    locationId:number;
    locationName:string;
    name: string;
    email:string;
    phoneNumber: string;
    visitDate: string;
    packageType: string;
    requirements: string[];
    noOfPeople: number;
    passengerDetails: Passengers[];
}

export interface Passengers {
    passengerName:string;
    gender:string;
    age:number;
    preferences:string[];
}

export interface Locations {
    id:number;
    name:string;
    image: string;
    description:string
}