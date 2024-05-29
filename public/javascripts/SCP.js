function calls(obj) {
    let xml=new XMLHttpRequest();
    xml.open("POST","./"+obj.name,true)
    xml.setRequestHeader("Content-type","application/json");
    xml.send(JSON.stringify(obj.data));
    xml.responseType='text';
    xml.onreadystatechange=function() {
        if (xml.readyState === 4 && xml.status === 200) {
            let e = JSON.parse(xml.responseText);
            if(e.code!=-1){
                obj.success(e);
            }
            else{
                alert('系统错误，请联系比赛组织者！');
            }
        }
    }
}

function getvalue(id) {
    return document.getElementById(id).value;
}

function show_hidden(id,bool) {
    if(bool) document.getElementById(id).style="";
    else document.getElementById(id).style="display:none";
}
