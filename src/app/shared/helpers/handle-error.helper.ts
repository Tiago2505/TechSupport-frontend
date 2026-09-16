import { AbstractControl, FormControl } from "@angular/forms";


export class HandleError{


  static getErrorMessage(formControl: AbstractControl, fieldName: string): string{

    if(formControl.hasError('required')){
      return `${fieldName} is required`;
    }else if(formControl.hasError('email')){
      return 'Invalid email'
    }else if(formControl.hasError('minlength')){
      return `${fieldName} is invalid`;
    }else if(formControl.hasError('pattern')){
      return `${fieldName} does not meet the requirements`;
    }
    else{
      return 'Error not implemented';
    }




  }

}
