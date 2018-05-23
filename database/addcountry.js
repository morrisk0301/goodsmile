//country list

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
addcountry.set = function(xlsxname, callback) {
    var method_detail = [];
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
        return callback(method_detail);
    });
};


module.exports = addcountry;