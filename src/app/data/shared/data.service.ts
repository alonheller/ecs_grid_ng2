import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { environment } from './../../../environments/environment';
import 'rxjs/add/operator/map';
import { EcsResponse } from './../model/ecsResponse';
import { EcsResponseParsed } from './../model/ecsResponseParsed';
import { Actions } from './../model/actions';

@Injectable()
export class DataService {

  private host: string;

  constructor(private http: Http) {
    this.host = environment.host;
  }

  private addHeaders(): Headers {
    let headers = new Headers();
    headers.append('Action', 'Login');
    headers.append('Content-Type', 'ecs/json');
    return headers;
  }

  private createRequestObject(action: string, params: any) {
    return { 'Action': action, 'Parameters': params };
  }

  private get(url) {
    return this.http.get(this.host, { headers: this.addHeaders() })
      .map((res: EcsResponse) => JSON.parse(res._body));
  }

  private post(data: any): Observable<Response> {
    return this.http.post(this.host, data, { headers: this.addHeaders() })
      .map((res: EcsResponse) => JSON.parse(res._body));      
  }

  login(user: string, password: string): Observable<Response> {
    // Delete Cookie
    document.cookie = "ECSFusionAuth=; expires=Thu, 01 Jan 1970 00:00:00 UTC";

    let data = this.createRequestObject(Actions.LOGIN, { 'username': user, 'password': password, 'rememberMe': false });

    return this.post(data)
    .map((res:EcsResponseParsed) => {         
         document.cookie = res.ReturnValue.Ticket;
         return res;
       })
    
  }

  getLocationAlarms(locationId: number, showWarnings: boolean) {
  }

  getLocationRoutersAlarms(locationId: number, openTickets: boolean) {
  }

  /*
  function createRequestObject(action, parameters) {
  return {'Action': action, 'Parameters': parameters};
}

function sendRequest(strHttpMethod, requestObj, action, extract, postProcess, enforceReadingFromNetwork, saveToCache, headers, configKeyValuePairs, remoteUrl) {
  var deferred = $q.defer();

  $log.log('HTTP: ', requestObj.Action, '(', requestObj.parameters != undefined ? requestObj.parameters : '', ')');

  var req = {
    method: strHttpMethod,
    url: remoteUrl || baseUrl,
    headers: headers || {'Action': action},
    data: requestObj
  };

  // Adding extra parameters for configuration object
  angular.forEach(configKeyValuePairs, function (value, key) {
    req[key] = value;
  });

  // Check if data is already in cache, and user didn't enforce to get data from the server
  var foundInCache = false;
  if (enableCache && ((_.isUndefined(enforceReadingFromNetwork) || !enforceReadingFromNetwork) && saveToCache === true)) {
    var cacheIndex = isExistInCache(req);
    if (cacheIndex > -1) {
      $log.debug('request back from cache: ', req.data.Action, ', Parameters: ', req.data.parameters);
      foundInCache = true;
      deferred.resolve(cache[cacheIndex].result);
    }
  }

  if (!foundInCache) {
    $http(req).success(function (data, status, headers, config) {
      $log.debug('Response Success <Action: ', action, '> Data: ', data);
      if (data && data.ReturnValue && (data.ReturnValue.faultcode || data.ReturnValue.faultstring)) {
        $log.error('Error on network: ', data.ReturnValue.faultstring);
        deferred.reject(data);
      }
      else {
        if (extract !== undefined && extract !== null) {
          data = $parse(extract)(data);
        }

        if (postProcess !== undefined) {
          data = postProcess(data);
        }

        if (saveToCache) {
          var cacheItem = {request: req, result: data};
          if (cache.length < cacheSize) {
            cache.push(cacheItem);
          }
          else {
            cache.splice(cacheSize - 5, 5);
            cache.unshift(cacheItem);
          }
        }
        deferred.resolve(data);
      }
    }).error(function (data, status, headers, config) {
      $log.log('Response Failed  <Action: ', action, '> Data: ', data);
      deferred.reject(data);
    });
  }

  return deferred.promise;
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

function initAfterLoggedIn() {
  var deffered = $q.defer();

  var commonDataPromise = commonDataService.getCommonData();
  var authUserPromise = networkService.getAuthenticatedUser();
  var topologyInitPromise = topologyService.init();

  var promises = [commonDataPromise, authUserPromise, topologyInitPromise];

  $q.all(promises).then(
    function success(result) {
      navigatorService.init();
      model.authenticatedUser = result[1];
      deffered.resolve();
    },
    function error(errorResult) {
      $log.error('Something wrong in login', errorResult);
      deffered.reject();
    }
  );

  return deffered.promise;
}

   */
}
