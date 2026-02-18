/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 91.15853658536585, "KoPercent": 8.841463414634147};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6809668989547039, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.01, 500, 1500, "RegisterRequest"], "isController": false}, {"data": [0.995, 500, 1500, "LoginRequest-1"], "isController": false}, {"data": [0.915, 500, 1500, "LoginRequest-0"], "isController": false}, {"data": [0.68, 500, 1500, "UpdateProfilePage"], "isController": false}, {"data": [0.7, 500, 1500, "UpdateRequest"], "isController": false}, {"data": [0.46, 500, 1500, "AccountDetails "], "isController": false}, {"data": [0.5, 500, 1500, "LoginRequest"], "isController": false}, {"data": [0.985, 500, 1500, "RegisterPage"], "isController": false}, {"data": [0.7, 500, 1500, "TransferRequest"], "isController": false}, {"data": [0.952020202020202, 500, 1500, "LogoutRequest-1"], "isController": false}, {"data": [0.946969696969697, 500, 1500, "LogoutRequest-0"], "isController": false}, {"data": [0.0, 500, 1500, "BillpayRequest"], "isController": false}, {"data": [0.6, 500, 1500, "BillpayPage"], "isController": false}, {"data": [0.2, 500, 1500, "HomePage"], "isController": false}, {"data": [0.67, 500, 1500, "TransactionsRequest"], "isController": false}, {"data": [0.4825, 500, 1500, "LogoutRequest"], "isController": false}, {"data": [0.96, 500, 1500, "GetAccountByCustomerIdRequest"], "isController": false}, {"data": [0.995, 500, 1500, "OverviewPage"], "isController": false}, {"data": [0.79, 500, 1500, "Transaction DetailsRequest"], "isController": false}, {"data": [0.75, 500, 1500, "TransferPage"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2296, 203, 8.841463414634147, 654.0021777003471, 271, 40717, 404.0, 1362.2000000000007, 1645.7500000000005, 1897.0900000000006, 44.66404699840486, 204.78456354195035, 12.710871086303156], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["RegisterRequest", 100, 99, 99.0, 340.74, 285, 621, 318.0, 429.0, 430.95, 619.2299999999991, 2.2901112994091513, 15.807649794748777, 1.343114494114414], "isController": false}, {"data": ["LoginRequest-1", 100, 0, 0.0, 334.12999999999994, 276, 502, 315.5, 442.70000000000005, 477.95, 501.8399999999999, 2.2682937894116044, 13.736025183731797, 0.5482448367962619], "isController": false}, {"data": ["LoginRequest-0", 100, 0, 0.0, 403.03000000000003, 315, 680, 367.5, 537.6000000000001, 561.9, 678.9499999999995, 2.2656727915354464, 0.6615587545596665, 0.6759404666153114], "isController": false}, {"data": ["UpdateProfilePage", 100, 0, 0.0, 773.94, 283, 1795, 444.5, 1635.5, 1680.6999999999998, 1794.87, 2.32725918685564, 22.652413658684168, 0.46249730910656517], "isController": false}, {"data": ["UpdateRequest", 100, 0, 0.0, 707.9899999999999, 279, 1657, 577.0, 1271.5, 1487.3999999999992, 1656.1499999999996, 2.327042561608452, 0.6317556954366695, 1.0805749394968933], "isController": false}, {"data": ["AccountDetails ", 100, 0, 0.0, 1023.5700000000002, 301, 1920, 1104.5, 1687.000000000001, 1746.75, 1919.86, 2.304041288419888, 22.066460430970924, 0.46688336654992857], "isController": false}, {"data": ["LoginRequest", 100, 0, 0.0, 737.2299999999997, 627, 1019, 701.5, 843.0, 872.8, 1018.6999999999998, 2.2505795242274886, 14.285905183084644, 1.215400856345509], "isController": false}, {"data": ["RegisterPage", 100, 0, 0.0, 383.14, 276, 3878, 333.0, 407.6, 427.29999999999984, 3852.3299999999867, 2.2880153754633232, 15.871743689367591, 0.44048764757699166], "isController": false}, {"data": ["TransferRequest", 100, 0, 0.0, 746.56, 279, 1808, 544.5, 1414.5, 1715.2999999999988, 1807.96, 2.328342918345014, 0.7025956657896575, 0.7924096748469115], "isController": false}, {"data": ["LogoutRequest-1", 198, 0, 0.0, 352.8787878787878, 271, 1775, 303.0, 471.3999999999999, 623.05, 930.5299999999922, 4.065374507227332, 18.266394636477497, 0.8287868424564717], "isController": false}, {"data": ["LogoutRequest-0", 198, 0, 0.0, 353.1010101010101, 271, 1387, 296.0, 526.0999999999999, 751.7999999999994, 1384.03, 4.064456532895412, 1.5598939623319306, 0.7770001539566868], "isController": false}, {"data": ["BillpayRequest", 100, 100, 100.0, 965.8899999999994, 272, 1843, 1031.5, 1738.8, 1782.5, 1842.5499999999997, 2.327475852438031, 0.7136986500640056, 1.1762390172233212], "isController": false}, {"data": ["BillpayPage", 100, 0, 0.0, 918.6499999999997, 278, 1840, 1013.0, 1758.7000000000003, 1787.6999999999998, 1839.84, 2.32698841159771, 33.50511083009494, 0.4488088000884256], "isController": false}, {"data": ["HomePage", 100, 2, 2.0, 2370.01, 1076, 40717, 1624.0, 1977.9, 2004.9, 40716.59, 2.4024024024024024, 14.227665165165165, 0.33079954954954954], "isController": false}, {"data": ["TransactionsRequest", 100, 0, 0.0, 689.9300000000002, 277, 1568, 610.5, 1185.9, 1389.75, 1567.98, 2.3012311586698884, 2.373616564549534, 0.5674422534806122], "isController": false}, {"data": ["LogoutRequest", 200, 2, 1.0, 707.7749999999995, 549, 2201, 601.5, 1019.4000000000001, 1221.1499999999999, 2123.3200000000006, 4.080799836768007, 19.72166075800857, 1.6067750841664967], "isController": false}, {"data": ["GetAccountByCustomerIdRequest", 100, 0, 0.0, 386.1099999999998, 274, 536, 364.0, 497.6, 516.4499999999998, 535.98, 2.2686540075773043, 0.7268111657478618, 0.5173151472356451], "isController": false}, {"data": ["OverviewPage", 100, 0, 0.0, 353.50000000000006, 284, 655, 317.5, 460.9, 481.95, 653.4199999999992, 2.2683452421458545, 13.736336764205511, 0.4397134087558126], "isController": false}, {"data": ["Transaction DetailsRequest", 100, 0, 0.0, 481.79, 277, 1171, 405.5, 792.7, 808.95, 1170.8, 2.328505565128301, 8.156113746041541, 0.4683161339239976], "isController": false}, {"data": ["TransferPage", 100, 0, 0.0, 586.2899999999998, 274, 1690, 429.5, 1064.1000000000004, 1216.6, 1689.6, 2.328722462856877, 18.61386070164408, 0.4514173914815332], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500/Internal Server Error", 2, 0.9852216748768473, 0.08710801393728224], "isController": false}, {"data": ["Test failed: text expected to contain /Welcome/", 97, 47.783251231527096, 4.224738675958188], "isController": false}, {"data": ["Test failed: text expected to contain /Bill Payment Complete/", 100, 49.26108374384236, 4.355400696864112], "isController": false}, {"data": ["525/&lt;none&gt;", 4, 1.9704433497536946, 0.17421602787456447], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2296, 203, "Test failed: text expected to contain /Bill Payment Complete/", 100, "Test failed: text expected to contain /Welcome/", 97, "525/&lt;none&gt;", 4, "500/Internal Server Error", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["RegisterRequest", 100, 99, "Test failed: text expected to contain /Welcome/", 97, "500/Internal Server Error", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["BillpayRequest", 100, 100, "Test failed: text expected to contain /Bill Payment Complete/", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["HomePage", 100, 2, "525/&lt;none&gt;", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["LogoutRequest", 200, 2, "525/&lt;none&gt;", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
