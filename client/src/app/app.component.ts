import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AppService } from './app.service';
import { HotTableModule, HotTableRegisterer } from '@handsontable/angular';
import Handsontable from 'handsontable';
import { registerAllModules } from 'handsontable/registry';
import { Stock } from './model/stock.model';
import { FormsModule } from '@angular/forms';
import { ChartDemoComponent } from './chart-demo/chart-demo.component';
import { Chart } from 'chart.js';
registerAllModules();

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    CommonModule,
    RouterOutlet,
    HotTableModule,
    FormsModule,
    ChartDemoComponent,
  ],
})
export class AppComponent implements OnInit {
  title = 1;
  isTimeSet = true;
  id = 'hotInstance';
  data: Stock[] = [];
  setdate = '';
  setCurrentDate = '';
  selectMin = 1;
  private hotRegisterer = new HotTableRegisterer();
  columnsData: Handsontable.ColumnSettings[] = [];

  hotSettings: Handsontable.GridSettings = {
    columns: this.columnsData,
    className: 'htCenter',
    rowHeaders: true,
    columnHeaderHeight: 10,
    multiColumnSorting: true,
    manualColumnResize: true,
    // filters: true,
    manualColumnMove: true,
    rowHeights: 10,
    comments: true,
    width: '100%',
    height: '80vh',
    fixedColumnsStart: 1,
    readOnly: true,
    renderAllRows: true,

    // viewportColumnRenderingOffset: 40,
    // viewportRowRenderingOffset: 'auto',
    // dropdownMenu: ['filter_by_value', 'filter_operators', 'filter_action_bar'],
  };

  constructor(private service: AppService) {}
  ngOnInit() {
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = String(currentDate.getMonth() + 1).padStart(2, '0');
    let day = String(currentDate.getDate()).padStart(2, '0');

    let formattedDate = year + '-' + month + '-' + day;
    this.setdate = formattedDate;
    // this.setdate = '2024-04-01';
    this.setCurrentDate = formattedDate;
    this.fetchData();

    setInterval(() => {
      this.fetchData();
    }, 61000);
  }

  setTimeStamp() {
    this.fetchData();
  }

  fetchData() {
    if (this.setdate > this.setCurrentDate) {
      return;
    }

    let c = new Date();
    let s = new Date(new Date().setHours(9, 14));
    let e = new Date(new Date().setHours(15, 30));
    if (this.setdate == this.setCurrentDate) {
      if (s.getTime() > c.getTime()) {
        console.log('no data');
        return;
      }
      if (s.getTime() < c.getTime() && e.getTime() > c.getTime()) {
        e = c;
      }
    }
    this.service.getData(this.setdate).subscribe((res) => {
      const hot = this.hotRegisterer.getInstance(this.id);
      this.data = res.map((item) => {
        let arr = [];
        for (let ele in item.records) {
          arr.push({ x: ele, y: +item.records[ele].percentage });
        }
        item['rates'] = arr;
        return item;
      });

      this.columnsData = [];
      while (s.getTime() < e.getTime()) {
        let t =
          e.getHours().toString().padStart(2, '0') +
          ':' +
          e.getMinutes().toString().padStart(2, '0');

        this.columnsData.unshift({
          data: 'records.' + t + '.pric_perc_Place',
          title: t,
          width: 100,
          height: 50,
          renderer: 'html',
        });
        e.setMinutes(e.getMinutes() - this.selectMin);
      }
      this.columnsData.unshift(
        {
          data: 'link',
          title: 'COMPANY',
          height: 50,
          width: 150,
          className: 'wraptext',
          renderer: 'html',
        },
        {
          title: 'GRAPH',
          width: 207,
          renderer: function (
            instance: Handsontable.Core,
            td: HTMLTableCellElement,
            row: any,
            column: any,
            prop: any,
            value: any,
            cellProperties: Handsontable.CellProperties
          ) {
            const rates = instance.getDataAtRowProp(row, 'rates');
            if (td.hasChildNodes()) {
              td.childNodes.forEach((child) => {
                td.removeChild(child);
              });
            }

            const chartContainer = document.createElement('div');
            chartContainer.className = 'chart';
            const chartCanvas = document.createElement('canvas');
            chartContainer.appendChild(chartCanvas);
            td.appendChild(chartContainer);
            const ctx2d = chartCanvas.getContext('2d');

            if (!ctx2d) {
              return;
            }

            const data = {
              labels: [],
              datasets: [
                {
                  label: '',
                  data: rates,
                  borderWidth: 2,
                  pointRadius: 0,
                  borderColor: '#444',
                  fill: false,
                  lineTension: 0,
                },
              ],
            };

            cellProperties.chart = new Chart(ctx2d, {
              type: 'line',
              data: data,
              options: {
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    mode: 'index',
                    intersect: false,
                  },
                },
                hover: {
                  mode: 'nearest',
                  intersect: true,
                },
                scales: {
                  x: {
                    display: true,
                  },
                  y: {
                    display: true,
                  },
                },
              },
            });

            return td;
          },
        }
      );

      hot.updateSettings({ columns: this.columnsData, data: this.data });
      console.log('=====>', this.columnsData.length);

      // hot.scrollViewportTo({
      //   row: 10,
      //   col: this.columnsData.length - 1,
      //   verticalSnap: 'bottom',
      //   horizontalSnap: 'end',
      // });
    });
  }
  getDataWithDate() {
    this.fetchData();
  }
}
