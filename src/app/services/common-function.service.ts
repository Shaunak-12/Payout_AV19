import { Injectable } from '@angular/core';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Injectable(
{
  providedIn: 'root', // This ensures the service is globally available
})

export class CommonFunctionService {
  storageData: any = {};
  PageName: any;
  constructor(private toastr: ToastrService) {}
  
  getDatesInRange(startDate: any, endDate: any, type: string) {
    const date = new Date(startDate.getTime());
    const dates = [];
    while (date <= endDate) {
      dates.push(moment(date))
      date.setDate(date.getDate() + 1);
    }
    return dates;
  }

  exportSheetWiseExcel(data: any, FileName: any, sheetName: any) {
    import("xlsx").then(xlsx => {
      let wb = xlsx.utils.book_new();
      var str_array = sheetName.split(',');
      for (var i = 0; i < str_array.length; i++) {
        let ws = xlsx.utils.json_to_sheet(data[i]);
        xlsx.utils.book_append_sheet(wb, ws, str_array[i]);
      }
      xlsx.writeFile(wb, FileName + ".xlsx");
    });
  }
  
  filterValue(event: any) {
    let digits = event.key.replace(/[^0-9.]/g, '');
    if (digits !== event.key) {
      event.preventDefault();
    }
    return parseFloat(digits);
  };
  
  CheckStrEmptyNull(value: any) {
    if (value == null || value == "" || value == undefined)
    return true;
    return false;
  }
  
  EmailValidation(value: any) {
    var EmailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (EmailRegex.test(value))
    return true;
    return false;
  }

  MobileValidation(value: any) {
    var MobileRegex = new RegExp("^[6789][0-9]{9}$");
    if (MobileRegex.test(value))
    return true;
    return false;
  }

  ConfirmPasswordValidate(textPassword: any, textConfirmPassword: any) {
    var password = textPassword;
    var confirmPassword = textConfirmPassword;
    if (password != confirmPassword) {
      return false;
    }
    return true;
  }
  
  CheckLengthValidate(value: any) {
    if (value.length < 6) {
      return false;
    }
    return true;
  }

  toastMsg(type: string, title: string, msg: string) {
    if (type == 'success') {
      this.toastr.success(msg, title, {positionClass: 'toast-top-center'});
    }
    if (type == 'error') {
      this.toastr.error(msg, title, {positionClass: 'toast-top-center'});
    }
    if (type == 'warning') {
      this.toastr.warning(msg, title, {positionClass: 'toast-top-center'});
    }
  }

  isValidDate(d:any) {
    return d instanceof Date && !isNaN(Date.parse(d.toString()));
  }

  roundOffNum(numData:any){
    let signage = '';
    if(numData && numData<0){
      signage='-';
      numData=Math.abs(numData);
    }
    if(numData && ((numData%1)!=0)){
      let x=numData.toFixed(2);
      x=x.toString();
      let afterPoint = '';
      if(x.indexOf('.') > 0){
        afterPoint = x.substring(x.indexOf('.'),x.length);
      }
      x = Math.floor(x);
      x=x.toString();
      let lastThree = x.substring(x.length-3);
      let otherNumbers = x.substring(0,x.length-3);
      if(otherNumbers != ''){
        lastThree = ',' + lastThree;
      }
      let res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;
      return(signage+res);
    }
    else if(numData){
      let x=numData;
      x=x.toString();
      let lastThree = x.substring(x.length-3);
      let otherNumbers = x.substring(0,x.length-3);
      if(otherNumbers != ''){
        lastThree = ',' + lastThree;
      }
      let res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
      return(signage+res);
    }
    else{
      return('0.00');
    }
  }
  
}
