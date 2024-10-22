import { DateType } from "./date";

export enum Gender {
  Male = 1,
  FeMale = 2,
}

export enum PersonnelStatus {
  Active = 1,
  Disable = 2,
}

export type PersonType = {
  created_at: DateType;
  fullname: string;
  gender: Gender;
  id: string;
  mobile: string;
  national_code: string;
  status: PersonnelStatus;
};

export type PersonAutocompleteType = {
  fullname: string;
  id: string;
  mobile: string;
  national_code: string;
};
