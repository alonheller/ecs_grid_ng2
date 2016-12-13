import {Component, OnInit} from '@angular/core';
import {GridOptions} from 'ag-grid/main';
import {environment} from '../environments/environment';
import {AuthService} from './auth/shared/auth.service';
import {DataService} from './data/shared/data.service';
import {Statuses} from './data/model/statuses';

declare var moment: any;

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
      enableColResize: true,
      enableSorting: true

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
        status: rows[i].StatusCode,
        precision: rows[i].Precision,
        measureUnitName: rows[i].MeasureUnitName,
        measureUnitID: rows[i].MeasureUnitID,
        statusTimestamp: rows[i].StatusTimestamp,
        alarmClear: rows[i].AlarmClear,
        statusType: rows[i].StatusType
      });
    }

    this.gridOptions.api.setRowData(rowData);
    ;
  }

  valueCellRenderer(params) {
    return `<span>
            ${params.value.toFixed(params.data.precision)}
            ${params.data.measureUnitID == 3 ? '°' : ''}
            ${params.data.measureUnitID == 8 ? '°' : ''}
            ${params.data.measureUnitName}
            </span>`;
  }

  durationCellRenderer(params) {
    return `<span>${moment(params.value).fromNow()}</span>`;
  }

  timeCellRenderer(params) {
    return `<span>${moment(params.value).format('lll')}</span>`;
  }

  statusCellRenderer(params) {
    var statusName = Statuses[params.value.toString()].caption;

    if (!params.data.statusType || params.data.statusType === 0) {
      var statusNameMeta = Statuses[params.value.toString()];

      if (statusNameMeta) {
        // alarmClear == defaults.NAFEM_TRUE
        if (params.data.alarmClear == 1) {
          statusName += " (Ack.)";
        }
      }
    }
    else if (params.data.statusType == 1) {
      switch (params.value) {
        case 0:
          statusName = 'OK';
          break;
        case 1:
          statusName = 'Power Alert';
          break;
        case 2:
          statusName = 'Charging Fault';
          break;
        case 3:
          statusName = 'Disconnected';
          break;
      }
    }

    return statusName;
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
        cellRenderer: this.valueCellRenderer
      },
      {
        headerName: "Time", field: "statusTimestamp", sort: 'desc',
        cellRenderer: this.timeCellRenderer
      },
      {
        headerName: "Duration", field: "statusTimestamp",
        cellRenderer: this.durationCellRenderer
      },
      {
        headerName: "Status", field: "status",
        cellRenderer: this.statusCellRenderer
      }
    ];
  }


}
