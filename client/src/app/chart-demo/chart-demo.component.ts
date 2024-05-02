import { Component } from '@angular/core';
import Chart from 'chart.js/auto';

import { HotTableModule, HotTableRegisterer } from '@handsontable/angular';
import Handsontable from 'handsontable';
import { registerAllModules } from 'handsontable/registry';
import { CommonModule } from '@angular/common';

registerAllModules();
@Component({
  selector: 'app-chart-demo',
  standalone: true,
  templateUrl: './chart-demo.component.html',
  styleUrl: './chart-demo.component.css',
  imports: [CommonModule, HotTableModule, ChartDemoComponent],
})
export class ChartDemoComponent {
  dataObject = [
    {
      company: 'Tata Motors - DVR Ordinary',
      graph: '<canvas id="Tata Motors - DVR Ordinary"></canvas>',
      link: "<a href='https://groww.in/stocks/tata-motors-dvr-ordinary'target='_blank'>Tata Motors - DVR Ordinary</a>",
      rates: [
        {
          x: '09:15',
          y: 2.85,
        },
        {
          x: '09:16',
          y: 1.85,
        },
        {
          x: '09:17',
          y: 3.85,
        },
      ],
    },
    {
      company: 'Tata Motors - DVR Ordinary',
      graph: '<canvas id="Tata Motors - DVR Ordinary"></canvas>',
      link: "<a href='https://groww.in/stocks/tata-motors-dvr-ordinary'target='_blank'>Tata Motors - DVR Ordinary</a>",
      rates: [
        {
          x: '09:15',
          y: 10.85,
        },
        {
          x: '09:16',
          y: 17.85,
        },
        {
          x: '09:17',
          y: 12.85,
        },
      ],
    },
    {
      company: 'Tata Motors - DVR Ordinary',
      graph: '<canvas id="Tata Motors - DVR Ordinary"></canvas>',
      link: "<a href='https://groww.in/stocks/tata-motors-dvr-ordinary'target='_blank'>Tata Motors - DVR Ordinary</a>",
      rates: [
        {
          x: '09:15',
          y: 18.85,
        },
        {
          x: '09:16',
          y: 17.85,
        },
        {
          x: '09:17',
          y: 14.85,
        },
      ],
    },
    // {
    //   currency: 'Euro',
    //   rates: [
    //     {
    //       x: '09:17',
    //       y: 0,
    //     },
    //     {
    //       x: '09:20',
    //       y: 0,
    //     },
    //     {
    //       x: '09:21',
    //       y: 8.47,
    //     },
    //   ],
    // },
    // {
    //   currency: 'Euro',
    //   rates: [
    //     {
    //       x: '09:17',
    //       y: 0,
    //     },
    //     {
    //       x: '09:20',
    //       y: 0,
    //     },
    //     {
    //       x: '09:21',
    //       y: 8.47,
    //     },
    //   ],
    // },
  ];
  id = 'test';
  hotSettings = {
    data: this.dataObject,
    colWidths: [200, 200],
    columns: [
      {
        title: 'hello',
        data: 'company',
        type: 'text',
        className: 'htMiddle',
      },
      {
        width: 207,
        renderer: function (
          instance: any,
          td: any,
          row: any,
          column: any,
          prop: any,
          value: any,
          cellProperties: any
        ) {
          if (!td.hasChildNodes()) {
            if (cellProperties.chart) {
              cellProperties.chart.destroy();
              cellProperties.chart = void 0;
            }
          } else if (cellProperties.chart) {
            cellProperties.chart.update();
            return td;
          }
          var rates = instance.getDataAtRowProp(row, 'rates');
          var chartContainer = document.createElement('div');
          chartContainer.className = 'chart';
          var chartCanvas = document.createElement('canvas');
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
      },
      {
        title: 'hello',
        data: 'company',
        type: 'text',
        className: 'htMiddle',
      },
    ],
    // rowHeights: 100,
    licenseKey: 'non-commercial-and-evaluation',
    // readOnly: true,
    // renderAllRows: true,
    // rowHeaders: true,
    // columnHeaders: true,
    // columnHeaderHeight: 10,
  };

  constructor() {}
}
