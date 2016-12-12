import {Component, OnInit} from '@angular/core';
import {GridOptions} from 'ag-grid/main';
import {environment} from '../environments/environment';
import {AuthService} from './auth/shared/auth.service';
import {DataService} from './data/shared/data.service';

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

  constructor(private authService: AuthService, private dataService: DataService) {
    this.gridOptions = {
      enableColResize: true
    };
  }

  ngOnInit() {
    this.authService.login()
      .subscribe(() => this.getUserLocations());
  }

  private getUserLocations() {
    this.dataService.getUserLocations()
      .subscribe((res: any) => {
        this.getLocationAlarms(res.ReturnValue.$values[0].ID)
      });
  }

  private getLocationAlarms(locationId: number) {
    this.dataService.getLocationAlarms(locationId, this.showWarnings)
      .subscribe((res) => {
        this.gridOptions.api.addEventListener('gridReady', this.onGridReady);
        this.createRowData(res);
        this.createColumnDefs();
        this.gridOptions.api.hideOverlay();
      });
  }

  private onGridReady(event: Event) {
    console.log('GRID IS READY :)')
    this.gridOptions.api.sizeColumnsToFit();
  }

  private createRowData(rows: Array<any>) {
    var rowData: any[] = [];

    for (var i = 0; i < rows.length; i++) {
      rowData.push({
        location: rows[i].LocationName,
        asset: rows[i].AssetName,
        assetMeasure: rows[i].AssetMeasureName,
        value: rows[i].LastValue,
        duration: rows[i].LastUpdate,
        status: rows[i].StatusCode,
        precision: rows[i].Precision,
        measureUnitName: rows[i].MeasureUnitName,
        measureUnitID: rows[i].MeasureUnitID
      });
    }

    this.gridOptions.api.setRowData(rowData);;
  }

  myCellRenderer(params) {
    return `<span>
            ${params.value.toFixed(params.data.precision)}
            ${params.data.measureUnitID == 3 ? '°' : ''}
            ${params.data.measureUnitID == 8 ? '°' : ''}
            ${params.data.measureUnitName}
            </span>`;
  }

  private createColumnDefs() {
    this.columnDefs = [
      {
        headerName: "Location", field: "location", width: 220
      },
      {
        headerName: "Precision", field: "precision", hide: true
      },
      {
        headerName: "MeasureUnitName", field: "measureUnitName", hide: true
      },
      {
        headerName: "MeasureUnitID", field: "measureUnitID", hide: true
      },
      {
        headerName: "Equipment", field: "asset"
      },
      {
        headerName: "Asset Measure", field: "assetMeasure"
      },
      {
        headerName: "Value", field: "value",
        cellRenderer: this.myCellRenderer
      },
      {
        headerName: "Duration", field: "duration"
      },
      {
        headerName: "Status", field: "status"
      }
    ];
  }


}
