import { Component, OnInit } from '@angular/core';
import { GridOptions } from 'ag-grid/main';
import { environment } from '../environments/environment';
import { AuthService } from './auth/shared/auth.service';
import { DataService } from './data/shared/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  host = environment.host;
  user = environment.user;
  password = environment.password;
  showWarnings = environment.showWarnings;
  openTickets = environment.openTickets;

  refreshIntervalInSeconds = environment.refreshIntervalInSeconds;

  public showGrid: boolean;
  private gridOptions: GridOptions;
  public rowData: any[];
  private columnDefs: any[];

  constructor(private authService: AuthService, private dataService:DataService) {
    // we pass an empty gridOptions in, so we can grab the api out
    this.gridOptions = <GridOptions>{};
  }

  ngOnInit() {
    this.authService.login()
      .subscribe(() => this.getUserLocations());
  }

  private getUserLocations() {
    this.dataService.getUserLocations()
      .subscribe((res:any) => {
        this.getLocationAlarms(res.ReturnValue.$values[0].ID)
      });
  }

  private getLocationAlarms(locationId:number) {
    this.dataService.getLocationAlarms(locationId, this.showWarnings)
      .subscribe((res) => {
        this.createRowData(res);
        this.createColumnDefs();
        this.gridOptions.api.hideOverlay()
      });
  }

  private createRowData(rows:Array<any>) {
    var rowData: any[] = [];

    for (var i = 0; i < rows.length; i++) {
      rowData.push({
        location: rows[i].LocationName,
        asset: rows[i].AssetName,
        assetMeasure: rows[i].AssetMeasureName,
        value: rows[i].LastValue,
        duration: rows[i].LastUpdate,
        status: rows[i].StatusCode
      });
    }

    this.gridOptions.api.setRowData(rowData);
  }

  private createColumnDefs() {
    this.columnDefs = [
      {
        headerName: "Location", field: "location",
        width: 150, pinned: true
      },
      {
        headerName: "Equipment", field: "asset",
        width: 150, pinned: true
      },
      {
        headerName: "Asset Measure", field: "assetMeasure",
        width: 150, pinned: true
      },
      {
        headerName: "Value", field: "value",
        width: 150, pinned: true
      },
      {
        headerName: "Duration", field: "duration",
        width: 150, pinned: true
      },
      {
        headerName: "Status", field: "status",
        width: 150, pinned: true
      }
    ];
  }


}
