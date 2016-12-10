import { Injectable } from '@angular/core';
import { UserCredentials } from './../model/userCredentials';
import { environment } from './../../../environments/environment';
import { DataService } from './../../data/shared/data.service';

@Injectable()
export class AuthService {

  private user: string;
  private password: string;

  constructor(private dataService: DataService) {
    this.user = environment.user;
    this.password = environment.password;
  }

  login() {
    console.log('Trying to login with: ', this.user);    

    return this.dataService.login(this.user, this.password);      
  }

  /*
  function login(user, password, rememberMe) {
    $cookies.remove("ECSFusionAuth");
    var req = createRequestObject('Login', {'username': user, 'password': password, 'rememberMe': rememberMe});
    return sendRequest(httpMethod.POST, req, 'Login', 'ReturnValue', addCookie);
  }

  function addCookie(data) {
    var cookie = decodeURI(data.Ticket.split('ECSFusionAuth=')[1]);
    $cookies.put('ECSFusionAuth', cookie);
    document.cookie = "ECSFusionAuth="+cookie;
    return data;
  }

function login(user) {
  var deferred = $q.defer();

  networkService.login(user.name, user.password, false).then(
    function success(result) {
      model.userName = user.name;
      model.userId = result.UserID;
      model.dropPassValidation = result.DropPassValidation;

      if (result.UserID > 0)
      {
        switch (result.AccountStatus) {
          case accountStatus.PENDING:
            modalService.showChangePasswordModal(model);
            deferred.reject(result);
            break;
          case accountStatus.ACTIVE:
            initAfterLoggedIn().then(
              function success(initAfterLoggedIn) {
                deferred.resolve(result)
              },
              function error(initAfterLoggedIn) {
                deferred.reject(result)
              }
            );
            break;
          case accountStatus.LOCKED:
            modalService.showInfoModal('_ACCOUNT_LOCK_TITLE_', '_ACCOUNT_LOCK_DESCRIPTION_');
            deferred.reject(result);
            break;
          case accountStatus.CREATED:
            modalService.showInfoModal('_ACCOUNT_VERIFICATION_REQUIRED_TITLE_', '_ACCOUNT_VERIFICATION_REQUIRED_DESCRIPTION_');
            deferred.reject(result);
            break;
        }
      }
      else
      {
        //loginService_onFault(new FaultEvent(FaultEvent.FAULT, false, true,
          //new Fault(event.statusCode.toString(), event.result.toString())));
      }
    },
    function error(result) {
      deferred.reject(result);
    }
  );

  return deferred.promise;
}

   */
}
