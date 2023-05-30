import { Component, Input, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '@environment/environment';
import { TranslateModule } from '@ngx-translate/core';
import { LocalStorageService } from '@core/services/local-storage.service';
import { LOCAL_STORAGE_CONSTANT } from '@core/constants/localstorage.constant';
import { cardCodeStatus, COUNTRY_LIST, DEFAULT_LANGUAGE, errorCode, messageType, REGEX_CONSTANTS } from '@core/constants/app.constants';
import { TranslateService } from '@ngx-translate/core';
import { OrderDetail, UserAddress, UserDetails, UserDetailsForm } from '@core/models/user.model';
import { CpTelInputComponent } from '@shared/cp-libs/cp-tel-input/cp-tel-input.component';
import { CommonModule } from '@angular/common';
import { AllowNumberOnlyDirective } from '@core/directives/allow-number-only.directive';
import { UserService } from '@core/services/user.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AlertToastrService } from '@core/services/alert-toastr.service';
import { CpLoaderComponent } from '@shared/cp-libs/cp-loader/cp-loader.component';
import { HttpErrorResponse } from '@angular/common/http';

@UntilDestroy()
@Component({
  selector: 'cp-cards-widget',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgSelectModule, MatStepperModule, MatIconModule, TranslateModule, FormsModule, ReactiveFormsModule, CpTelInputComponent, AllowNumberOnlyDirective, CpLoaderComponent],
  templateUrl: './cp-cards-widget.component.html',
  styleUrls: ['./cp-cards-widget.component.scss'],
})
export class CardsWidgetComponent {

  title = 'Calopad Cards Widget';
  readonly deployUrl = environment.deployUrl;
  currentLanguage: string;
  userDetailsForm: FormGroup<UserDetailsForm>;
  countryList = COUNTRY_LIST;
  emailRegex = REGEX_CONSTANTS.EMAIL_REGEX;
  integerRegex = REGEX_CONSTANTS.INTEGER_REGEX;
  cardCode = new FormControl('', Validators.required);
  @ViewChild('stepper') stepper: MatStepper;
  verifyCardCodeLoader = false;
  redeemCardCodeLoader = false;
  isCodeValid = false;
  orderDetail: OrderDetail;
  isCodeStatusValid = false;
  selectedIndex = 0;

  @Input() isAvailable = false;

  constructor(
    private localStorageService: LocalStorageService,
    private translateService: TranslateService,
    private userService: UserService,
    private toasterService: AlertToastrService
  ) {}

  ngOnInit(): void {
    this.setLanguage();
    this.initializeForm();
  }

  initializeForm(): void {
    this.userDetailsForm = new FormGroup<UserDetailsForm>({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      address: new FormGroup<UserAddress>({
        street: new FormControl('', Validators.required),
        zip: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{4,6}$')]),
        city: new FormControl('', Validators.required),
        country: new FormControl(null, Validators.required),
      }),
      phoneNo: new FormControl('', Validators.required),
    })
  }

  get formControls(): UserDetailsForm {
    return this.userDetailsForm.controls;
  }

  get addressControls(): UserAddress {
    return this.userDetailsForm.controls.address.controls;
  }

  verifyCardCode(): boolean | void {
    this.cardCode.markAsTouched();
    if (this.cardCode.invalid) {
      return true;
    }
    this.verifyCardCodeLoader = true;
    this.userService.verifyCardCode(this.cardCode.value)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.isCodeStatusValid = false;
          this.isCodeValid = true;
          this.verifyCardCodeLoader = false;
          this.toasterService.displaySnackBarWithTranslation('toasterMessage.verifyCodeSuccessful', messageType.success);
        },
        error: (error: HttpErrorResponse) => {
          this.verifyCardCodeLoader = false;
          this.isCodeValid = false;
          this.isCodeStatusValid = false;
          if (error.status === errorCode.notFound) {
            this.toasterService.displaySnackBarWithTranslation('toasterMessage.invalidCardCode', messageType.error);
            return;
          }
          switch (error.error.error) {
            case cardCodeStatus.redeemed:
              this.toasterService.displaySnackBarWithTranslation('toasterMessage.cardCodeRedeemed', messageType.error);
              break;
            case cardCodeStatus.blocked:
              this.toasterService.displaySnackBarWithTranslation('toasterMessage.cardCodeBlocked', messageType.error);
              break;
            case cardCodeStatus.valid:
              this.isCodeStatusValid = true;
              break;
          }
        }
      })
  }

  goToNextPage(): void {
    this.cardCode.markAsTouched();
    this.isCodeValid && this.stepper.next();
  }

  onSubmit(): boolean | void {
    this.userDetailsForm.markAllAsTouched();
    if (this.userDetailsForm.invalid) {
      return true;
    }
    const params: Partial<UserDetails> = {
      ...this.userDetailsForm.value, ...{ cardCode: this.cardCode.value }
    }
    this.redeemCardCodeLoader = true;
    this.userService.redeemCardCode(params)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: OrderDetail) => {
          this.redeemCardCodeLoader = false;
          this.orderDetail = res;
          this.toasterService.displaySnackBarWithTranslation('toasterMessage.orderPlacedSuccessful', messageType.success);
          this.stepper.next();
        },
        error: (error: HttpErrorResponse) => {
          this.redeemCardCodeLoader = false;
          if (error.status === errorCode.badRequest) {
            this.stepper.previous();
            this.verifyCardCode();
          }
        }
      })
  }

  setLanguage(): void {
    const localStorageLanguage = this.localStorageService.get(LOCAL_STORAGE_CONSTANT.CURRENT_LANGUAGE_STATE_KEY) as string;
    this.currentLanguage = localStorageLanguage || DEFAULT_LANGUAGE;
    this.translateService.setDefaultLang(this.currentLanguage);
    this.localStorageService.set(LOCAL_STORAGE_CONSTANT.CURRENT_LANGUAGE_STATE_KEY, this.currentLanguage);
  }

  changeLanguage(): void {
    this.localStorageService.set(LOCAL_STORAGE_CONSTANT.CURRENT_LANGUAGE_STATE_KEY, this.currentLanguage);
    this.translateService.use(this.currentLanguage);
  }
}
