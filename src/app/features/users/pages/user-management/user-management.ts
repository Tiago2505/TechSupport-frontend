import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { UserEntity } from '@features/users/entities';
import { UserService } from '@features/users/services/user.service';
import { InitialsPipe } from '@shared/pipes';
import { NavigationService } from '@shared/services/navigation.service';
import { EMPTY } from 'rxjs';
import { SuccessMessage } from '@shared/components/success-message/success-message';
import { ErrorMessage } from '@shared/components/error-message/error-message';

@Component({
  selector: 'user-management',
  imports: [InitialsPipe, DatePipe, SuccessMessage, ErrorMessage],
  templateUrl: './user-management.html',
})
export class UserManagement {

  constructor(){
    effect(()=>{
      if(this.allUsersRxResource.hasValue()){
        this.allUsers.set(this.allUsersRxResource.value());
      }
    });

    effect(()=>{
      if(this.deleteUserRxResource.hasValue() && this.deleteUserButtonPressed()){
        this.userDeleted.set(true);

        this.showMessageTimeout();

        setTimeout(() => {
          location.reload();
        }, 2000);

      }else if(this.deleteUserRxResource.error() && this.deleteUserButtonPressed()){
        this.showMessage();
      }
    })
  }

  userService = inject(UserService);
  navigationService = inject(NavigationService);

  allUsers = signal<UserEntity[]>([]);
  userId = signal<number | null>(null)
  userDeleted = signal<boolean>(false);
  deleteUserButtonPressed = signal<boolean>(false);
  showMessage = signal<boolean>(false);

  allUsersRxResource = rxResource({
    stream:()=>this.userService.getAll()
  });

  deleteUserRxResource = rxResource({
    params: ()=>({userId: this.userId()}),
    stream:({params})=>{
      if(!params.userId) return EMPTY;

      return this.userService.deleteUser(params.userId);
    }
  })

  goToUpdateUser(id: number){
    this.navigationService.goToUpdateUser(id);
  }

  deleteUserButton(id: number){

    const deleteUser = confirm(`Are you sure you want to delete user with id: ${id}?`);

    if(!deleteUser) return;

    this.deleteUserButtonPressed.set(true);

    this.userId.set(id);

  }

  showMessageTimeout(){
    this.showMessage.set(true);
    setTimeout(() => {
      this.showMessage.set(false);
    }, 2000);
  }
}
