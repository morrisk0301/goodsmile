//country list

var xlsx = require('xlsx');
var obj = xlsx.readFile('../public/EMS.xlsx'); // parses a file
//var obj = xlsx.parse(fs.readFileSync(__dirname + '/myFile.xlsx')); // parses a buffer
var first_sheet_name = obj.SheetNames[0];
var firstsheet = obj.Sheets[first_sheet_name];
var countrylist = [];
var countrynum = 176;

for(var i=2;i<=countrynum+1;i++){
    countrylist.push({
        country: firstsheet['A'+i].v,
        region: firstsheet['B'+i].v,
        fee: {
            below_5: firstsheet['C' + i].v,
            below1: firstsheet['D' + i].v,
            below1_5: firstsheet['E' + i].v,
            below2: firstsheet['F' + i].v,
            below2_5: firstsheet['G' + i].v,
            below3: firstsheet['H' + i].v,
            below3_5: firstsheet['I' + i].v,
            below4: firstsheet['J' + i].v,
            below4_5: firstsheet['K' + i].v,
            below5: firstsheet['L' + i].v,
            below5_5: firstsheet['M' + i].v,
            below6: firstsheet['N' + i].v,
            below6_5: firstsheet['O' + i].v,
            below7: firstsheet['P' + i].v,
            below7_5: firstsheet['Q' + i].v,
            below8: firstsheet['R' + i].v,
            below8_5: firstsheet['S' + i].v,
            below9: firstsheet['T' + i].v,
            below9_5: firstsheet['U' + i].v,
            below10: firstsheet['V' + i].v,
            below10_5: firstsheet['W' + i].v,
            below_11: firstsheet['X' + i].v,
            below11_5: firstsheet['Y' + i].v,
            below12: firstsheet['Z' + i].v,
            below12_5: firstsheet['AA' + i].v,
            below13: firstsheet['AB' + i].v,
            below13_5: firstsheet['AC' + i].v,
            below14: firstsheet['AD' + i].v,
            below14_5: firstsheet['AE' + i].v,
            below15: firstsheet['AF' + i].v,
            below15_5: firstsheet['AG' + i].v,
            below16: firstsheet['AH' + i].v,
            below16_5: firstsheet['AI' + i].v,
            below17: firstsheet['AJ' + i].v,
            below17_5: firstsheet['AK' + i].v,
            below18: firstsheet['AL' + i].v,
            below18_5: firstsheet['AM' + i].v,
            below19: firstsheet['AN' + i].v,
            below19_5: firstsheet['AO' + i].v,
            below20: firstsheet['AP' + i].v,
        }
    })
}

module.exports={
    countrylist: countrylist,
    countrynum: countrynum
};