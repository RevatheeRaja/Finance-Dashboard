export const lineChartData = [
    [
      { x: 'Mon', y: 21 },
      { x: 'Tue', y: 24 },
      { x: 'Wed', y: 36 },
      { x: 'Thu', y: 38 },
      { x: 'Fri', y: 54 },
      { x: 'Sat', y: 57 },
      { x: 'Sun', y: 70 },
    ],
 
  ];
export const lineCustomSeries = [
    { dataSource: lineChartData[0],
      xName: 'x',
      yName: 'y',
      name: 'Germany',
      width: '2',
      marker: { visible: true, width: 10, height: 10 },
      type: 'Line' },
  
  ];

