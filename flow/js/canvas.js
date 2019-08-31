document.oncontextmenu = function(event) {
    event.preventDefault();
};

document.onclick = function(event) {
    $("#menu").css("display", "none");
}

var index = 1;
var nodeIdArray = new Array()
var selectLineFlag = false;

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("Text", ev.target.id);
}

function drop(ev) {
    if (selectLineFlag) {
        return false;
    }
    ev.preventDefault();
    var data = ev.dataTransfer.getData("Text");
    var modifyElement = document.getElementById(data);
    if (!modifyElement.getAttribute("isNew") || modifyElement.getAttribute("isNew") != 'true') {
        var newDataElement = document.getElementById(data).cloneNode(true);
        var newId = newDataElement.id + index;
        nodeIdArray.push(newId);
        $(newDataElement).removeClass("nodeModal")
            .addClass("activeNode")
            .attr("onmousedown", "nodeMouseDown(event,this)")
            .attr("onclick", "")
            .attr("isNew", "true")
            .attr("id", newId)
            .css("margin", "0px")
            .css("position", "absolute")
            .css("background-color", "#fff");
        index++;
        modifyElement = newDataElement;
    }
    modifyElement.style.top = (ev.pageY - 40) + "px";
    modifyElement.style.left = (ev.pageX - 40 - parseInt($($(".leftDiv")[0]).css("width").split("px")[0])) + "px";
    ev.target.appendChild(modifyElement);
}

function selectNode(obj) {
    if (obj.id == "line") {
        selectLineFlag = true;
        $(".activeNode").css("background-color", "#fff").attr("draggable", "false");
    } else {
        selectLineFlag = false;
        $(".activeNode").css("background-color", "#fff").attr("draggable", "true");
    }
    $(".nodeModal").css("background-color", "#fff").attr("draggable", "false");
    $(obj).css("background-color", "#ece9e9").attr("draggable", "true");
}

var startNodeId = "";

function nodeMouseDown(event, obj) {
    if (event.button == 2) {
        event.preventDefault();
        $("#menu").css("display", "block");
        $("#menu").css("top", parseInt($(obj).css("top").split("px")) + 30);
        $("#menu").css("left", parseInt($(obj).css("left").split("px")) + 80);
        $("#menu").attr("curModifyId", obj.id);
    }
    if (event.button == 0) {
        if (selectLineFlag) {
            console.log($(obj).css("left") + ":" + $(obj).css("top"))
            startNodeId = obj.id;
        }
    }
}

function nodeMouseUp(event, obj) {
    if (selectLineFlag && startNodeId != "") {
        var startX = parseInt($("#" + startNodeId).css("left").split("px")[0]) + 40
        var startY = parseInt($("#" + startNodeId).css("top").split("px")[0]) + 40
        var endX = (event.pageX - parseInt($($(".leftDiv")[0]).css("width").split("px")[0]))
        var endY = (event.pageY - 20)
        var newLineObjStr = " <line x1 = '" + startX + "px' y1 = '" + startY + "px'" +
            "' x2 = '" + endX + "px' y2 = '" + endY + "px' " +
            "stroke = '#000' stroke-width = '3' marker-end = 'url(#arrow)' " +
            "startNode = '' endNode = '' />";
        $("#lineSvg").html($("#lineSvg").html() + newLineObjStr)
    }
    startNodeId = "";
}

function deleteNode() {
    $("#" + $("#menu").attr("curModifyId")).remove()
}

function modifyNode() {

}