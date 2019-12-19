// function selectSelectbox(id, value) {
//     switch (id) {
//         case "sel_ord":
//             level["ordered"] = value;
//             updateGraph(value);
//             // executeProgram();
//             break;
//         case "sel_sbs":
//             level["semester"] = value;
//             filename = level["semester"];
//             filename = filename.slice(0, 4) + "_" + filename.slice(5, 6) + "_dualdegree.json";
//             loadJSON(path + filename, success);
//             break;
//     }
// }

function getSelectedbox(id) {
    let select = document.getElementById(id);
    return select.options[select.selectedIndex].getAttribute("value");
}

function getColorsByDvisions() {
    let colors = document.getElementById("colors");
    color["hs"]= colors.children.color_hs.getAttribute("value");
    color["ns"]= colors.children.color_ns.getAttribute("value");
    color["en"]= colors.children.color_en.getAttribute("value");
    color["amp"]= colors.children.color_amp.getAttribute("value");
    color["dd"] = colors.children.color_dd.getAttribute("value");
}

function convertHex2RGB(hexa) {
    let rgb = [];
    rgb.push(parseInt(hexa.slice(0,2), 16));
    rgb.push(parseInt(hexa.slice(2,4), 16));
    rgb.push(parseInt(hexa.slice(4,6), 16));
    return rgb;
}