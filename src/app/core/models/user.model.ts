import { FormControl, FormGroup } from "@angular/forms";

export interface UserDetailsForm {
  firstName: FormControl<string>,
  lastName: FormControl<string>,
  email: FormControl<string>,
  address: FormGroup<UserAddress>,
  phoneNo: FormControl<string>,
}

export interface UserAddress {
  street: FormControl<string>,
  zip: FormControl<string>,
  city: FormControl<string>,
  country: FormControl<string>,
}

export interface UserDetails {
  firstName: string;
  lastName: string;
  address: Partial<Address>;
  email: string;
  phoneNo: string;
  cardCode: string;
}

export interface Address {
  city: string;
  zip: string;
  country: string;
  street: string;
}

export interface OrderDetail {
  orderNo: string;
  trackingUrl: string;
}
