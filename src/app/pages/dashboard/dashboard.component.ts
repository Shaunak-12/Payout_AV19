import { CardListComponent } from '@/shared/card-list/card-list.component';
import { TitleHeaderComponent } from '@/shared/title-header/title-header.component';


import {Component, OnInit} from '@angular/core';
import moment from 'moment';
import { ApiService } from '../../services/api.service';
import { config } from '../../services/config';
import { CommonFunctionService } from '../../services/common-function.service';

@Component({
  selector: 'app-dashboard',
  imports: [TitleHeaderComponent, CardListComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{
  todayDate = new Date();
  dateDashValue: Date[]=[new Date,new Date];
  dashboardCount: any =[];
  dashboardCountLoading = false;
  
  constructor(private apiservice :ApiService,private utilities : CommonFunctionService) {}
  
  ngOnInit(): void {  
    this.GetDashboardCount(this.dateDashValue);
  }
  
  GetDashboardCount(DateValues:Date[]) {
    let request = {
      "StartDateTime": moment(DateValues[0]).format("MM-DD-yyyy"),
      "EndDateTime": moment(DateValues[1]).format("MM-DD-yyyy")
    };
    this.dashboardCount=[];
    this.dashboardCountLoading = true;
    this.apiservice.sendRequest(config['GetDashBoardCount'], request).subscribe((data: any) => {
      this.dashboardCountLoading = false;
      this.dashboardCount = [
        { "name": "Approved Withdraw", "value": this.utilities.roundOffNum(data.TotalWithdraw), "icon": "ion-person-add", "feather": "user-plus", "color": "#1c84ee"},
        { "name": "Pending Withdraw", "value": this.utilities.roundOffNum(data.PendingWithdraw), "icon": "ion-pie-graph", "feather": "pie-chart", "color": "#33c38e"},
        { "name": "Number of Request", "value": this.utilities.roundOffNum(data.NumberOfRequest), "icon": "ion-stats-bars", "feather": "bar-chart", "color": "#ef6767"},
        { "name": "Balance", "value": this.utilities.roundOffNum(data.AccountBalance), "icon": "ion-paper-airplane", "feather": "send", "color": "#ffcc5a"}
      ];
    }, (error) => {
      this.dashboardCountLoading = false;
      console.log(error);
    });
  }
  
}

