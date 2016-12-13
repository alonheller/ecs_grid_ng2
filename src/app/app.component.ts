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
  totalAlarmsCounter = 0;
  refreshIntervalInSeconds = environment.refreshIntervalInSeconds;
  isLoading:boolean;

  public showGrid: boolean;
  private gridOptions: GridOptions;
  public rowData: any[];
  private columnDefs: any[];

  constructor(private authService: AuthService, private dataService: DataService) {
    this.isLoading = false;

    this.gridOptions = {
      enableColResize: true,
      enableSorting: true,
      enableFilter: true,
      columnDefs: [
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
          cellRenderer: this.valueCellRenderer,
          width: 100, suppressSizeToFit: true
        },
        {
          headerName: "Time", field: "statusTimestamp", sort: 'desc',
          cellRenderer: this.timeCellRenderer,
          width: 150, suppressSizeToFit: true
        },
        {
          headerName: "Duration", field: "statusTimestamp",
          cellRenderer: this.durationCellRenderer,
          width: 150, suppressSizeToFit: true
        },
        {
          headerName: "Status", field: "status",
          cellRenderer: this.statusCellRenderer,
          width: 167, suppressSizeToFit: true,
          cellClassRules: {
            'red': function(params) {
              return (params.value == "4" || params.value == "5" || params.value == "6" || params.value == "7" ||
              params.value == "8" || params.value == "9" || params.value == "101" || params.value == "102")
            },
            'orange': function(params) {
              return (params.value == "2" || params.value == "103")
            },
            'gray': function(params) {
              return (params.value == "-1" || params.value == "0")
            },
            'green': function(params) {
              return params.value == "1"
            }

          }
        }
      ]
    };
  }

  ngOnInit() {
    this.isLoading = true;
    this.authService.login()
      .subscribe(() => this.getUserLocations());
  }

  private getUserLocations() {
    this.dataService.getUserLocations()
      .subscribe((res: any) => {
        this.getLocationAlarms(res.ReturnValue.$values[0].ID)
      });
  }

  /*private onGridReady() {
    setTimeout(() => {
      this.gridOptions.api.sizeColumnsToFit();
    }, 9000);

  }*/

  private getLocationAlarms(locationId: number) {
    this.dataService.getLocationAlarms(locationId, this.showWarnings)
      .subscribe((res) => {
        this.totalAlarmsCounter = res.length;
        this.createRowData(res);
        this.isLoading = false;
        this.showGrid = true;;

      });
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
    this.gridOptions.api.sizeColumnsToFit();
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


}
