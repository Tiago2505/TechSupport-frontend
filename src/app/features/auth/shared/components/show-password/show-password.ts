import { Component, output, signal } from '@angular/core';
import { EyeIcon } from '../eye-icon/eye-icon';
import { EyeOffIcon } from '../eye-off-icon/eye-off-icon';

@Component({
  selector: 'show-password',
  imports: [EyeIcon, EyeOffIcon],
  templateUrl: './show-password.html',
})
export class ShowPassword {

  showPassword = signal<boolean>(false);

  showPasswordOutput = output<boolean>();

  showPasswordToggle(){
    this.showPassword() ? this.showPassword.set(false) : this.showPassword.set(true);

    this.showPasswordOutput.emit(this.showPassword());
  }


}
