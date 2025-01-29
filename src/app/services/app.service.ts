import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { config } from './config';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  public user: any = null;
  private authLoader = new BehaviorSubject<boolean>(false);
  myVariable$ = this.authLoader.asObservable();
  
  constructor(private router: Router, private toastr: ToastrService, private apiservice :ApiService) {}
  
  async loginByAuth({email, password}: {email: any, password: any}) {
      try {
          let param = '?Email='+email+'&Password='+password;
          this.authLoader.next(true);
          this.apiservice.getRequest(config['loginApi'] + param).subscribe((response: any) => {
              this.authLoader.next(false);
              if(response.n=="1"){
                  let companyDetails = {CompanyName: response.CompanyName,LoginToken: response.LoginToken,UserId: response.UserId}
                  localStorage.setItem('CompanyDetails', JSON.stringify(companyDetails));
                  this.router.navigate(['/']);
              }
              else{
                  this.toastr.error('',response.response.Msg,{positionClass: 'toast-top-center'});
                  localStorage.clear();
              }
          })
      } catch (error:any ) {
          this.authLoader.next(false);
          this.toastr.error(error.message);
      }
  }
  
  // async registerByAuth({email, password}) {
  //     try {
  //         const token = await Gatekeeper.registerByAuth(email, password);
  //         localStorage.setItem('token', token);
  //         await this.getProfile();
  //         this.router.navigate(['/']);
  //     } catch (error) {
  //         this.toastr.error(error.message);
  //     }
  // }
  
  logout() {
      localStorage.removeItem('CompanyDetails');
      this.user = null;
      this.router.navigate(['/login']);
  }
}

