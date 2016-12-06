import { Component } from '@angular/core';
import { GridOptions } from 'ag-grid/main';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ag-grid!';

  public showGrid: boolean;
  private gridOptions: GridOptions;
  public rowData: any[];
  private columnDefs: any[];

  constructor() {
    // we pass an empty gridOptions in, so we can grab the api out
    this.gridOptions = <GridOptions>{};
    this.createRowData();
    this.createColumnDefs();
    this.showGrid = true;
  }

  private createRowData() {
    var rowData: any[] = [];

    for (var i = 0; i < 10000; i++) {      
      rowData.push({
        location: 'aaa',
        asset: 'myAsset',
        assetMeasure: "myAsset",
        value: "value",
        duration: "duration",
        status: "status"
      });
    }

    this.rowData = rowData;
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
