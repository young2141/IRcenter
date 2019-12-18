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

    // let obj = {};


    // rgb = convertHex2RGB(colors.children.color_hs.getAttribute("value").slice(1, 7));
    // color["hs"]= am4core.color(colors.children.color_hs.getAttribute("value"));

    // rgb = convertHex2RGB(colors.children.color_ns.getAttribute("value").slice(1, 7));
    // obj["r"] = rgb[0]; obj["g"] = rgb[1]; obj["b"] = rgb[2];
    // color["ns"]= am4core.color(colors.children.color_ns.getAttribute("value"));

    // rgb = convertHex2RGB(colors.children.color_en.getAttribute("value").slice(1, 7));
    // obj["r"] = rgb[0]; obj["g"] = rgb[1]; obj["b"] = rgb[2];
    // color["en"]= am4core.color(colors.children.color_en.getAttribute("value"));

    // rgb = convertHex2RGB(colors.children.color_amp.getAttribute("value").slice(1, 7));
    // obj["r"] = rgb[0]; obj["g"] = rgb[1]; obj["b"] = rgb[2];
    // color["amp"]= am4core.color(colors.children.color_amp.getAttribute("value"));

    // rgb = convertHex2RGB(colors.children.color_dd.getAttribute("value").slice(1, 7));
    // obj["r"] = rgb[0]; obj["g"] = rgb[1]; obj["b"] = rgb[2];
    // color["dd"] = am4core.color(colors.children.color_dd.getAttribute("value"));
    // // color["dd"]= Object.assign({}, obj);
}

function convertHex2RGB(hexa) {
    let rgb = [];
    rgb.push(parseInt(hexa.slice(0,2), 16));
    rgb.push(parseInt(hexa.slice(2,4), 16));
    rgb.push(parseInt(hexa.slice(4,6), 16));
    return rgb;
}