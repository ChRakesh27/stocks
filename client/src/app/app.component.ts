import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AppService } from './app.service';
import { HotTableModule, HotTableRegisterer } from '@handsontable/angular';
import Handsontable from 'handsontable';
import { registerAllModules } from 'handsontable/registry';
import { Record, Stock } from './model/stock.model';
import { FormsModule } from '@angular/forms';
registerAllModules();

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HotTableModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 1;

  id = 'hotInstance';
  data: Stock[] = [];
  setdate = '';
  setCurrentDate = '';
  selectMin = 1;
  private hotRegisterer = new HotTableRegisterer();
  columnsData: Handsontable.ColumnSettings[] = [
    {
      data: 'company',
      title: 'COMPANY',
      width: 150,
    },
  ];

  hotSettings: Handsontable.GridSettings = {
    columns: this.columnsData,
    className: 'htCenter htMiddle',
    rowHeaders: true,
    columnHeaderHeight: 30,
    multiColumnSorting: true,
    manualColumnResize: true,
    // filters: true,
    manualColumnMove: true,
    rowHeights: 30,
    comments: true,
    width: '100%',
    height: '85vh',
    fixedColumnsStart: 1,
    viewportColumnRenderingOffset: 40,
    viewportRowRenderingOffset: 'auto',
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
    this.setCurrentDate = formattedDate;
    this.fetchData();

    // this.service.getData(this.setdate).subscribe((res) => {
    //   const hot = this.hotRegisterer.getInstance(this.id);
    //   this.data = res;
    //   let c = new Date();
    //   let s = new Date(new Date().setHours(9, 15));
    //   let e = new Date(new Date().setHours(15, 30));

    //   if (s.getTime() > c.getTime()) {
    //     console.log('no data');
    //     return;
    //   }

    //   if (s.getTime() < c.getTime() && e.getTime() > c.getTime()) {
    //     e = c;
    //   }

    //   let count = 0;
    //   while (s.getTime() < e.getTime() && count !== 30) {
    //     count++;
    //     let t =
    //       e.getHours().toString().padStart(2, '0') +
    //       ':' +
    //       e.getMinutes().toString().padStart(2, '0');
    //     this.columnsData.push({
    //       data: 'records.' + t,
    //       title: t,
    //       width: 35,
    //       renderer: this.PriceRender,
    //     });
    //     e.setMinutes(e.getMinutes() - this.selectMin);
    //   }

    //   hot.updateSettings({ columns: this.columnsData, data: this.data });
    // });

    // setInterval(() => {
    //   this.service.getData().subscribe((res) => {
    //     this.data = res;
    //     this.title++;
    //     console.log('🚀 ~  this.data:', res[0]);
    //   });
    // }, 60000);
  }

  setTimeStamp() {
    this.columnsData = [
      {
        data: 'company',
        title: 'COMPANY',
        width: 150,
      },
    ];
    let c = new Date();

    let s = new Date(new Date().setHours(9, 15));
    let e = new Date(new Date().setHours(15, 30));

    if (s.getTime() > c.getTime()) {
      console.log('no data');
      return;
    }

    if (s.getTime() < c.getTime() && e.getTime() > c.getTime()) {
      e = c;
    }

    const hot = this.hotRegisterer.getInstance(this.id);
    let count = 0;
    while (s.getTime() <= e.getTime() && count != 30) {
      count++;
      let t =
        e.getHours().toString().padStart(2, '0') +
        ':' +
        e.getMinutes().toString().padStart(2, '0');

      this.columnsData.push({
        data: 'records.' + t,
        title: t,
        width: 35,
        renderer: this.PriceRender,
      });
      e.setMinutes(e.getMinutes() - this.selectMin);
    }
    hot.updateSettings({ columns: this.columnsData });
  }

  PriceRender = (
    instance: Handsontable.Core,
    TD: HTMLTableCellElement,
    row: number,
    col: number,
    prop: string | number,
    value: Record,
    cellProperties: Handsontable.CellProperties
  ) => {
    if (!value) {
      TD.innerHTML = '';
      return;
    }
    cellProperties.comment = {
      value: value.price,
      style: { width: 80, height: 35 },
      readOnly: true,
    };
    TD.innerHTML = value.percentage;
  };
  fetchData() {
    if (this.setdate > this.setCurrentDate) {
      return;
    }

    let c = new Date();
    let s = new Date(new Date().setHours(9, 15));
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
      this.data = res;
      this.columnsData = [
        {
          data: 'company',
          title: 'COMPANY',
          width: 150,
        },
      ];
      let count = 0;
      while (s.getTime() < e.getTime() && count !== 30) {
        count++;
        let t =
          e.getHours().toString().padStart(2, '0') +
          ':' +
          e.getMinutes().toString().padStart(2, '0');

        this.columnsData.push({
          data: 'records.' + t,
          title: t,
          width: 35,
          renderer: this.PriceRender,
        });
        e.setMinutes(e.getMinutes() - this.selectMin);
      }

      // let t = '10:15';

      // this.columnsData.splice(1, 0, {
      //   data: 'records.' + t,
      //   title: t,
      //   width: 35,
      //   renderer: this.PriceRender,
      // });
      // t = '09:35';

      // this.columnsData.splice(1, 0, {
      //   data: 'records.' + t,
      //   title: t,
      //   width: 35,
      //   renderer: this.PriceRender,
      // });

      hot.updateSettings({ columns: this.columnsData, data: this.data });
    });
  }
  getDataWithDate() {
    this.fetchData();
  }
}

// let count = 0;
// while (s.getTime() <= e.getTime() && count !== 30) {
//   count++;
//   let t =
//     s.getHours().toString().padStart(2, '0') +
//     ':' +
//     s.getMinutes().toString().padStart(2, '0');

//   this.columnsData.splice(1, 0, {
//     data: 'records.' + t,
//     title: t,
//     width: 35,
//     renderer: this.PriceRender,
//   });
//   console.log('🚀 ~ t:', this.columnsData);
//   s.setMinutes(s.getMinutes() + +this.selectMin);

//   if (s.getMinutes() >= 60) {
//     s.setHours(s.getHours() + 1, 0);
//   }
// }
