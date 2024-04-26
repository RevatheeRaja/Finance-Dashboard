export const areaChartData = [
  [
    { x: "Jan", y: 75 },
    { x: "Feb", y: 24 },
    { x: "Mar", y: 63 },
    { x: "Apr", y: 38 },
    { x: "May", y: 54 },
    { x: "Jun", y: 27 },
    { x: "Jul", y: 70 },
    { x: "Aug", y: 45 },
    { x: "Sep", y: 83 },
    { x: "Oct", y: 22 },
    { x: "Nov", y: 56 },
    { x: "Dec", y: 42 },
  ],
  [
    { x: "Jan", y: 45 },
    { x: "Feb", y: 12 },
    { x: "Mar", y: 33 },
    { x: "Apr", y: 43 },
    { x: "May", y: 45 },
    { x: "Jun", y: 75 },
    { x: "Jul", y: 33 },
    { x: "Aug", y: 55 },
    { x: "Sep", y: 10 },
    { x: "Oct", y: 45 },
    { x: "Nov", y: 28 },
    { x: "Dec", y: 65 },
  ],
];

export const areaCustomSeries = [
  {
    dataSource: areaChartData[0],
    xName: "x",
    yName: "y",
    name: "Income",
    width: "2",
    marker: { visible: true, width: 10, height: 10 },
    type: "SplineArea",
    opacity:0.4,
    fill: "#2485FA"
  },
  {
    dataSource: areaChartData[1],
    xName: "x",
    yName: "y",
    name: "Expenditure",
    width: "2",
    marker: { visible: true, width: 10, height: 10 },
    type: "SplineArea",
    opacity:0.7,
    fill: "#FEC200"
  },
];
