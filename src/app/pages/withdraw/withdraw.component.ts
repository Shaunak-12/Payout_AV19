import { AdvanceTablePaginatorComponent } from '@/shared/advance-table-paginator/advance-table-paginator.component';
import { AdvanceTableComponent } from '@/shared/advance-table/advance-table.component';
import { TitleHeaderComponent } from '@/shared/title-header/title-header.component';


import { Component, OnInit } from '@angular/core';
import moment from 'moment';
import { ApiService } from '../../services/api.service';
import { config } from '../../services/config';
import { CommonFunctionService } from '../../services/common-function.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-withdraw',
  imports: [TitleHeaderComponent,AdvanceTableComponent,AdvanceTablePaginatorComponent],
  templateUrl: './withdraw.component.html',
  styleUrl: './withdraw.component.scss'
})
export class WithdrawComponent implements OnInit {
  todayDate = new Date();
  dateValue: any=[new Date(),new Date()];
  buttonData=[{name:'Export',disabled:true,value:'export'}]
  searchOptions = [{name:'All',value:0},{name:'Success',value:1},{name:'Created',value:2}];
  currentQuery:any = [];
  withdrawCollumns:any = [];
  withdrawCollumnLoading = false;
  withdrawCollumnNone:any = [[{value:'No Data Found',bg:'white-drop'}]]
  withdrawCollumnHeaders:any = [
    [{value:'Sr. No.',bg:'white-drop'},
    {value:'RequestId',bg:'white-drop'},
    {value:'Amount',bg:'white-drop'},
    {value:'Account Number',bg:'white-drop'},
    {value:'Bank Name',bg:'white-drop'},
    {value:'Branch Name',bg:'white-drop'},
    {value:'Account Holder Name',bg:'white-drop'},
    {value:'IFSC Code',bg:'white-drop'},
    {value:'Phone',bg:'white-drop'},
    {value:'Status',bg:'white-drop'},
    {value:'UTR Number',bg:'white-drop'},
    {value:'Description',bg:'white-drop'},
    {value:'Created Date',bg:'white-drop'}]
  ];
  
  withdrawData: any=[];
  withdrawRows: any=[];
  
  pageNo=1;
  rowCount: any={f:0,l:0,t:0};
  pageCount=[10,50,100,500,1000];
  pagesTotal=1;
  paginatorBlock:any=[];
  exportLoader = false;
  
  constructor(private apiservice :ApiService, private utilities : CommonFunctionService, private toastr: ToastrService) { }
  
  ngOnInit(): void {
    this.apiservice.myVariable$.subscribe((value: boolean) => {
      this.exportLoader=value;
    });
    let searchQuery = {
      "Dates":[this.dateValue[0],this.dateValue[1]],
      "Search": '',
      "PageNo": 1,
      "PageSize": this.pageCount[0]
    };
    this.currentQuery = searchQuery;
    this.GetWithdrawData(this.currentQuery);
  }
  
  searchWithdraw(searchQuery:any){
    this.currentQuery.Dates=[searchQuery[0],searchQuery[1]];
    this.currentQuery.Search=searchQuery.searchInput;
    this.currentQuery.PageNo = 1;
    this.GetWithdrawData(this.currentQuery);
  }
  
  onPaginatorChange(paginatorQuery:any){
    if(paginatorQuery.action=='next'){
      this.currentQuery.PageNo = this.currentQuery.PageNo+1;
    }
    else if(paginatorQuery.action=='previous'){
      this.currentQuery.PageNo = this.currentQuery.PageNo-1;
    }
    else if(paginatorQuery.action=='pageSize'){
      this.currentQuery.PageNo = 1;
      this.currentQuery.PageSize = paginatorQuery.pageSize;
    }
    else if(paginatorQuery.action=='pageNo'){
      this.currentQuery.PageNo = paginatorQuery.pageNo;
    }
    this.GetWithdrawData(this.currentQuery);
  }
  
  GetWithdrawData(searchQuery:any){
    let request = {
      "StartDateTime": moment(searchQuery.Dates[0]).format("MM-DD-yyyy"),
      "EndDateTime": moment(searchQuery.Dates[1]).format("MM-DD-yyyy"),
      "Search": searchQuery.Search,
      "PageNo": searchQuery.PageNo,
      "PageSize": searchQuery.PageSize
    };
    this.withdrawRows=[];
    this.withdrawCollumns=[];
    this.pagesTotal=1;
    this.buttonData[0].disabled=true;
    this.withdrawData=[];
    this.withdrawCollumnLoading = true;
    this.apiservice.sendRequest(config['GetWithdraw'], request).subscribe((data: any) => {
      this.withdrawCollumnLoading = false;
      this.currentQuery=searchQuery;
      this.withdrawData=data;
      if(this.withdrawData[0]){
        this.buttonData[0].disabled=false;
        this.withdrawCollumns=this.withdrawCollumnHeaders;
        this.pagesTotal=Math.ceil(this.withdrawData[0].TotalCount/searchQuery.PageSize);
        this.withdrawData.forEach((element:any,index:any) => {
          this.withdrawRows.push([
            {value:((this.currentQuery.PageNo-1)*this.currentQuery.PageSize)+(index+1),bg:'white-cell'},
            {value:element.RequestId,bg:'white-cell'},
            {value:this.utilities.roundOffNum(element.Amount),bg:'white-cell'},
            {value:element.AccountNumber,bg:'white-cell'},
            {value:element.BankName,bg:'white-cell'},
            {value:element.BranchName,bg:'white-cell'},
            {value:element.AccountHolderName,bg:'white-cell'},
            {value:element.IfscCode,bg:'white-cell'},
            {value:element.Phone,bg:'white-cell'},
            {value:element.StatusName,bg:'white-cell'},
            {value:element.UTRNumber,bg:'white-cell'},
            {value:element.Description,bg:'white-cell'},
            {value:element.CreatedDate?moment(element.CreatedDate).format("h:mm:ss a DD MMM yyyy"):'',bg:'white-cell'}
          ])
        });
        this.rowCount={f:this.withdrawRows[0][0].value,l:this.withdrawRows[this.withdrawRows.length-1][0].value,t:this.withdrawData[0].TotalCount};
        this.setPaginator();
      }
      else{
        this.rowCount={f:0,l:0,t:0};
        this.withdrawCollumns=this.withdrawCollumnNone;
      }      
    }, (error) => {
      this.withdrawCollumnLoading = false;
      console.log(error);
    });
  }

  setPaginator(){
    this.paginatorBlock = [];
    if (this.currentQuery.PageNo <= 4) {
      for (let i = 1; i <= 10 && i <= this.pagesTotal; i++) {
        this.paginatorBlock.push(i);
      }
    }
    else {
      for (let i = this.currentQuery.PageNo - 3; i <= this.currentQuery.PageNo + 6 && i <= this.pagesTotal; i++) {
        this.paginatorBlock.push(i);
      }
    }
  }
  
  onValueChange(val:any){
    if(val.col==14){      
      let request = "?TransactionId="+ this.withdrawData[val.row].TransactionId;
      this.withdrawRows[val.row][val.col].icon='Loading';
      this.apiservice.getRequest(config['MakeCallBackAllClient'] + request).subscribe((data: any) => {
        this.withdrawRows[val.row][val.col].icon='None';
        if(data.ErrorCode=='1'){
          window.open(data.Result, '_blank')?.focus();
        }
        else{
          this.toastr.clear();
          this.toastr.warning(this.withdrawData[val.row].TransactionId,data.ErrorMessage, {positionClass: 'toast-top-center'});
        }
      }, (error) => {
        this.withdrawRows[val.row][val.col].icon='None';
        console.log(error);
      });
    }
  }
  
  btnGridAction(){
      this.DownloadWithdrawData();
  }
  
  DownloadWithdrawData() {
    let request = "?Search="+ this.currentQuery.Search + "&StartDateTime=" + moment(this.currentQuery.Dates[0]).format("DD/MM/yyyy") + "&EndDateTime=" + moment(this.currentQuery.Dates[1]).format("DD/MM/yyyy")+"&intParam1=1";
    let docname = 'Withdraw_Download_'+moment(this.currentQuery.Dates[0]).format("DD/MM/yyyy");
    this.apiservice.exportExcel(config['DownLoadWithdrawExcel'] + request,docname);
  }
}