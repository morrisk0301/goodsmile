//country list

var method_detail=[];
var Excel = require('exceljs');
var workbook = new Excel.Workbook();

var addcountry = {};

function getfee(worksheet, row, columncount){
    var fee=[];
    for(var i=3;i<=columncount;i++){
        fee.push({
            fee_name: worksheet.getRow(1).getCell(i).value,
            fee_num: worksheet.getRow(row).getCell(i).value
        });
    }
    return fee;
}
addcountry.init = function(xlsxname){
  while(method_detail.length!=0) method_detail.pop();
  console.log('method_detail 초기화 됨');
  addcountry.set(xlsxname);
};

addcountry.set = function(xlsxname) {
    console.log(xlsxname+'shipping method 추가 요청');
    workbook.xlsx.readFile('../uploads/'+xlsxname+'.xlsx').then(function () {
        var worksheet = workbook.getWorksheet(1);
        for (var i = 2; i <= worksheet.rowCount; i++) {
            method_detail.push({
                country: worksheet.getRow(i).getCell(1).value,
                region: worksheet.getRow(i).getCell(2).value,
                fee: getfee(worksheet, i, worksheet.columnCount)
            });
        }
    });
};


module.exports={
    addcountry,
    method_detail: method_detail
};