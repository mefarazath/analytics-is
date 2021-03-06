var timeFrom;
var timeTo;
var timeUnit = null;
var listnedTimeFromValue;
var listnedTimeToValue;
var oTable;
var page = gadgetUtil.getCurrentPage();
var globalUniqueArray = [];
var TOPIC_USERNAME = "subscriberUser";
var TOPIC_USERPREF_DELETION = "subscriberUserPrefDeletion";
var TOPIC = "subscriber";
var TOPIC_FIRST_LOGIN = "subscriberFirstLogin";
var listnedAdditionalUserPrefs = "";
var firstLoginFilter = "";

$(function() {


    var historyParmExist = gadgetUtil.getURLParam("persistTimeFrom");

    if(historyParmExist == null){
        listnedTimeFromValue = gadgetUtil.timeFrom();
        listnedTimeToValue = gadgetUtil.timeTo();
    }else{
        var historyParms = gadgetUtil.getURLParams();

        for (var key in historyParms) {
            if (historyParms.hasOwnProperty(key)) {

                if(key == "persistTimeFrom"){
                    listnedTimeFromValue = historyParms[key];
                }else if(key == "persistTimeTo"){
                    listnedTimeToValue = historyParms[key];
                }else if(Object.keys(historyParms).length > 2){
                    var historyParamVal = historyParms[key].toString();
                    addUserPrefsToGlobalArray("Topic",key,historyParamVal.split("_")[0]);
                }
            }
        }
    }

    if (page.name == TYPE_OVERALL || page.name == TYPE_LOCAL || page.name == TYPE_FEDERATED) {
        var idpFilter = "";
        var columns = [];

        if(page.name == TYPE_OVERALL) {
            idpFilter = "";
            columns = [
                { title: "Context ID" },
                { title: "User Name" },
                { title: "Service Provider" },
                { title: "Subject Step" },
                { title: "Roles" },
                { title: "Tenant Domain"},
                { title: "IP" },
                { title: "Region" },
                { title: "Overall Authentication" },
                { title: "Timestamp" }
            ];
            
        } else if(page.name == TYPE_LOCAL) {
            idpFilter = "LOCAL";
            columns = [
                { title: "Context ID" },
                { title: "User Name" },
                { title: "Service Provider" },
                { title: "Userstore" },
                { title: "Tenant Domain"},
                { title: "Roles" },
                { title: "IP" },
                { title: "Region" },
                { title: "Local Authentication" },
                { title: "Timestamp" }
            ];
        } else if(page.name == TYPE_FEDERATED) {
            idpFilter = "FEDERATED";
            columns = [
                { title: "Context ID" },
                { title: "User Name" },
                { title: "Service Provider" },
                { title: "Identity Provider" },
                { title: "IP" },
                { title: "Region" },
                { title: "Authentication Step Success" },
                { title: "Timestamp" }
            ];

        }

        $.fn.dataTable.ext.errMode = 'none';
        oTable = $('#tblMessages').DataTable({
            scrollY: 500,
            scrollX: true,
            dom: '<"dataTablesTop"' +
                'f' +
                '<"dataTables_toolbar">' +
                '>' +
                'rt' +
                '<"dataTablesBottom"' +
                'lip' +
                '>',
            "processing": true,
            "serverSide": true,
            "searching": false,
            aaSorting: [],
            "columns" : columns,
            "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
                if(page.name == TYPE_OVERALL) {
                    if ( aData[8] == true )
                    {
                        $('td', nRow).eq(8).html(
                            '<div style="text-align: center;"><div style="width:8%;margin:-8px;height:38px;float:left;background-color:#5CB85C;"></div><div style="width: 92%;float:right; padding-left:8px;">Success</div></div>'
                        );
                    }
                    else
                    {
                        $('td', nRow).eq(8).html(
                            '<div style="text-align: center"><div style="width:8%;margin:-8px;height:38px;float:left;background-color:#D9534F;"></div><div style="width: 92%;float:right;padding-left:8px;">Failure</div></div>'
                        );
                    }
                } else if(page.name == TYPE_FEDERATED) {
                    if ( aData[6] == true )
                    {
                        $('td', nRow).eq(6).html(
                            '<div style="text-align: center;"><div style="width:8%;margin:-8px;height:38px;float:left;background-color:#5CB85C;"></div><div style="width: 92%;float:right; padding-left:8px;">Success</div></div>'
                        );
                    }
                    else
                    {
                        $('td', nRow).eq(6).html(
                            '<div style="text-align: center"><div style="width:8%;margin:-8px;height:38px;float:left;background-color:#D9534F;"></div><div style="width: 92%;float:right;padding-left:8px;">Failure</div></div>'
                        );
                    }
                } else if(page.name == TYPE_LOCAL){
                    if ( aData[8] == true )
                    {
                        $('td', nRow).eq(8).html(
                            '<div style="text-align: center;"><div style="width:8%;margin:-8px;height:38px;float:left;background-color:#5CB85C;"></div><div style="width: 92%;float:right; padding-left:8px;">Success</div></div>'
                        );
                    }
                    else
                    {
                        $('td', nRow).eq(8).html(
                            '<div style="text-align: center"><div style="width:8%;margin:-8px;height:38px;float:left;background-color:#D9534F;"></div><div style="width: 92%;float:right;padding-left:8px;">Failure</div></div>'
                        );
                    }
                }
            },
            "ajax": {
                "url" : AUTHENTICATION_CONTEXT,
                "data" : function (d) {
                    d.type = page.type;
                    d.timeFrom = parseInt(listnedTimeFromValue);
                    d.timeTo = parseInt(listnedTimeToValue);
                    d.listnedAdditionalUserPrefs = listnedAdditionalUserPrefs;
                    d.idpType = idpFilter;
                    d.firstLogin = firstLoginFilter;
                }
            }
        });
    } else if(page.name == TYPE_SESSIONS) {
        $.fn.dataTable.ext.errMode = 'none';
        oTable = $('#tblMessages').DataTable({
            scrollY: 600,
            scrollX: true,
            dom: '<"dataTablesTop"' +
                'f' +
                '<"dataTables_toolbar">' +
                '>' +
                'rt' +
                '<"dataTablesBottom"' +
                'lip' +
                '>',
            "processing": true,
            "serverSide": true,
            "searching": true,
            "language": {
                "search": "",
                "searchPlaceholder": "Search by Username..."
            },
            aaSorting: [],
            "columns" : [
                { title: "Session ID", visible: false },
                { title: "Username" },
                { title: "Start Time" },
                { title: "Termination Time" },
                { title: "End Time" },
                { title: "Duration (ms)" },
                { title: "Is Active" },
                { title: "Userstore Domain" },
                { title: "Tenant Domain" },
                { title: "IP" },
                { title: "Remember Me Flag" },
                { title: "Timestamp" }

            ],
            "ajax": {
                "url" : SESSION_CONTEXT,
                "data" : function (d) {
                    d.type = page.type;
                    d.timeFrom = parseInt(listnedTimeFromValue);
                    d.timeTo = parseInt(listnedTimeToValue);
                }
            }
        });
        $('#tblMessages_filter input').on('keyup', function () {
            oTable.search( this.value ).draw();
        });
    }

    $('#tblMessages tbody').on('click', 'tr', function() {
        var id = $(this).find("td:first").html();
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            dataTable.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
        /*if( timeUnit == null) {
         timeUnit = qs.timeUnit;
         }*/
        // var targetUrl = MESSAGE_PAGE_URL + "?" + PARAM_ID + "=" + id + "&timeFrom=" + timeFrom + "&timeTo=" + timeTo + "&timeUnit=" + timeUnit;;
        var targetUrl = MESSAGE_PAGE_URL + "?" + PARAM_ID + "=" + id;
        parent.window.location = targetUrl;
    });

});

gadgets.HubSettings.onConnect = function() {

    gadgets.Hub.subscribe(TOPIC, function(topic, data, subscriberData) {
        listnedTimeFromValue = data.timeFrom;
        listnedTimeToValue = data.timeTo;
        onDataChanged();
    });

    gadgets.Hub.subscribe(TOPIC_USERNAME, function(topic, data, subscriberData) {


        addUserPrefsToGlobalArray(topic,data.mode,data.userPrefValue);
        onDataChanged();
    });

    gadgets.Hub.subscribe(TOPIC_FIRST_LOGIN, function (topic, data, subscriberData) {
        var firstLogin = data.firstLogin;
        if(firstLogin == "enable") {
            firstLoginFilter = " AND isFirstLogin:true";
        } else {
            firstLoginFilter = "";
        }
        onDataChanged();
    });

    gadgets.Hub.subscribe(TOPIC_USERPREF_DELETION, function(topic, data, subscriberData) {

        var index;
        for(i=0;i<globalUniqueArray.length;i++){
            if(globalUniqueArray[i][2] == data.category){
                index = i;
                break;
            }
        }
        globalUniqueArray.splice(index, 1);
        listnedAdditionalUserPrefs = "";

        for(i=0;i<globalUniqueArray.length;i++){
            if(globalUniqueArray[i][2] == "USERNAME"){
                listnedAdditionalUserPrefs+= " AND username:\""+globalUniqueArray[i][1]+"\"";
            }else if(globalUniqueArray[i][2] == "SERVICEPROVIDER"){
                listnedAdditionalUserPrefs+= " AND serviceProvider:\""+globalUniqueArray[i][1]+"\"";
            }else if(globalUniqueArray[i][2] == "ROLE"){
                listnedAdditionalUserPrefs+= " AND rolesCommaSeparated:\""+globalUniqueArray[i][1]+"\"";
            }else if(globalUniqueArray[i][2] == "IDENTITYPROVIDER"){
                listnedAdditionalUserPrefs+= " AND identityProvider:\""+globalUniqueArray[i][1]+"\"";
            }else if(globalUniqueArray[i][2] == "USERSTORE"){
                listnedAdditionalUserPrefs+= " AND userStoreDomain:\""+globalUniqueArray[i][1]+"\"";
            }else if(globalUniqueArray[i][2] == "REGION"){
                listnedAdditionalUserPrefs+= " AND region:\""+globalUniqueArray[i][1]+"\"";
            }else if (globalUniqueArray[i][2] == "FIRST_TIME_SERVICEPROVIDER") {
                listnedAdditionalUserPrefs += " AND serviceProvider:\"" + globalUniqueArray[i][1] + "\"";
                listnedAdditionalUserPrefs += " AND isFirstLogin:true";
            }
        }

        onDataChanged();
    });
};


function addUserPrefsToGlobalArray(topic,mode,userPref){

    var valExist = false;

    if(globalUniqueArray.length != 0){
        for(i=0;i<globalUniqueArray.length;i++){
            if(globalUniqueArray[i][2] == mode){
                valExist = true;
                globalUniqueArray[i][0] = topic;
                globalUniqueArray[i][1] = userPref;
                break;
            }
        }

        if(!valExist){
            var arry = [topic,userPref,mode];
            globalUniqueArray.push(arry);
        }
    }else{
        var arry = [topic,userPref,mode];
        globalUniqueArray.push(arry);
    }

    listnedAdditionalUserPrefs = "";

    for(i=0;i<globalUniqueArray.length;i++){
        if(globalUniqueArray[i][2] == "USERNAME"){
            listnedAdditionalUserPrefs+= " AND username:\""+globalUniqueArray[i][1]+"\"";
        }else if(globalUniqueArray[i][2] == "SERVICEPROVIDER"){
            listnedAdditionalUserPrefs+= " AND serviceProvider:\""+globalUniqueArray[i][1]+"\"";
        }else if(globalUniqueArray[i][2] == "ROLE"){
            listnedAdditionalUserPrefs+= " AND rolesCommaSeparated:\""+globalUniqueArray[i][1]+"\"";
        }else if(globalUniqueArray[i][2] == "IDENTITYPROVIDER"){
            listnedAdditionalUserPrefs+= " AND identityProvider:\""+globalUniqueArray[i][1]+"\"";
        }else if(globalUniqueArray[i][2] == "USERSTORE"){
            listnedAdditionalUserPrefs+= " AND userStoreDomain:\""+globalUniqueArray[i][1]+"\"";
        }else if(globalUniqueArray[i][2] == "REGION"){
            listnedAdditionalUserPrefs+= " AND region:\""+globalUniqueArray[i][1]+"\"";
        }else if (globalUniqueArray[i][2] == "FIRST_TIME_SERVICEPROVIDER") {
            listnedAdditionalUserPrefs += " AND serviceProvider:\"" + globalUniqueArray[i][1] + "\"";
            listnedAdditionalUserPrefs += " AND isFirstLogin:true";
        }
    }

}

function onDataChanged() {

    oTable.clear().draw();
    oTable.ajax.reload().draw();
};

function onError(msg) {
    $("#canvas").html(gadgetUtil.getErrorText(msg));
};