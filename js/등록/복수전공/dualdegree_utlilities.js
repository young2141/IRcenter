function selectSelectbox(id, value) {
    switch (id) {
        case "sel_ord":
            level["ordered"] = value;
            executeProgram();
            break;
        case "sel_sbs":
            level["semester"] = value;
            filename = level["semester"];
            filename = filename.slice(0, 4) + "_" + filename.slice(5, 6) + "_dualdegree.json";
            loadJSON(path + filename);
            break;
    }
}

function getSelectedbox(id) {
    let select = document.getElementById(id);
    return select.options[select.selectedIndex].getAttribute("value");
}

function getColorsByDvisions() {
    let colors = document.getElementById("colors");
    let obj = {};
    let rgb;

    rgb = convertHex2RGB(colors.children.color_hs.getAttribute("value").slice(1, 7));
    obj["r"] = rgb[0]; obj["g"] = rgb[1]; obj["b"] = rgb[2];
    color.push({"인문사회계열": obj});

    rgb = convertHex2RGB(colors.children.color_ns.getAttribute("value").slice(1, 7));
    obj["r"] = rgb[0]; obj["g"] = rgb[1]; obj["b"] = rgb[2];
    color.push({"자연과학계열": obj});

    rgb = convertHex2RGB(colors.children.color_en.getAttribute("value").slice(1, 7));
    obj["r"] = rgb[0]; obj["g"] = rgb[1]; obj["b"] = rgb[2];
    color.push({"공학계열": obj});

    rgb = convertHex2RGB(colors.children.color_amp.getAttribute("value").slice(1, 7));
    obj["r"] = rgb[0]; obj["g"] = rgb[1]; obj["b"] = rgb[2];
    color.push({"예체능계열": obj});

    rgb = convertHex2RGB(colors.children.color_dd.getAttribute("value").slice(1, 7));
    obj["r"] = rgb[0]; obj["g"] = rgb[1]; obj["b"] = rgb[2];
    color.push({"타계열": obj});

    console.log(color);
}

function convertHex2RGB(hexa) {
    let rgb = [];
    rgb.push(parseInt(hexa.slice(0,2), 16));
    rgb.push(parseInt(hexa.slice(2,4), 16));
    rgb.push(parseInt(hexa.slice(4,6), 16));
    return rgb;
}