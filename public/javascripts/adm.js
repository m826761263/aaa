mmsinfo();
var look = window.setInterval(function (){mmsinfo()},5000)
function mmsinfo() {
    calls({
        name:'mmsinfo',
        data:{},
        success(e){
            console.log(e);
            showtable(e.data);
        }
    })
}
function showtable(table) {
    htmls="<tr><th>学号</th><th>姓名</th><th>学院</th><th>状态</th><th>进度</th><th>中英</th><th>听写</th><th>总分</th></tr>"
    for(let i =0;i<table.length;i++){
        htmls+='<tr class="'+(i%2==0?'alt':'')+'">\n' +
            '<td>'+table[i].id+'</td>\n' +
            '<td>'+table[i].name+'</td>\n' +
            '<td>'+table[i].objname+'</td>\n' +
            '<td>'+table[i].state+'</td>\n' +
            '<td>'+parseFloat(table[i].process).toFixed(2)+'</td>\n' +
            '<td>'+table[i].nscore+'</td>\n' +
            '<td>'+table[i].score+'</td>\n' +
            '<td>'+table[i].zscore+'</td>\n' +
            '</tr>';
    }
    document.getElementById('customers').innerHTML=htmls;
}
function setaudio(name){
    let intext=document.getElementById("Ztextarea").value;
    let input=document.getElementById("Zinput").value;
    if(intext&&input){
        calls({
            name,
            data:{
                url:input,
                txt:intext
            },
            success(e) {
                if(e.code==0){
                    alert('成功写入');
                    document.getElementById("Ztextarea").value="";
                    document.getElementById("Zinput").value="";
                }
                else if(e.code==1){
                    alert('权限不符，请重新进入');
                    window.location.href="./admm";
                }
                else if(e.code==2){
                    alert('音频不是标准的http资源');
                }
            }
        })
    }
    else{
        alert('你未填写完整');
    }
}
function sets(name){
    let input=document.getElementById("Zinput").value;
    if(input){
        calls({
            name,
            data:{
                id:input
            },
            success(e) {
                if(e.code==0){
                    alert('重置成功');
                    document.getElementById("Zinput").value="";
                }
                else{
                    alert('权限不符，请重新进入');
                    window.location.href="./admm";
                }
            }
        })
    }
    else{
        alert('你未填写');
    }
}
function insert(name){
    let intext="id\tik\tname\tobjname\n"
    intext+=(document.getElementById("Ztextarea").value).trim();
    var result=tojson(intext,"0");
    result=result.slice(2,result.length-2);
    result=result.split(",\n");
    for(let n in result){
        result[n]= (new Function("return " + result[n]))();
    }
    console.log(result);
    if(result){
        if(confirm('共'+result.length+'组数据，是否导入？')){
            loading('上传中');
            calls({
                name,
                data:{
                    result
                },
                success(e) {
                    alert('成功导入'+e.num+'组');
                    window.location.href="./admm";
                }
            })
        }
    }
    else{
        alert('数据有问题，请在大的输入框中直接复制表格文件。以学号、密码、姓名、系别的形式复制')
    }
}
function remove(name){
    let okarr = document.getElementById("Ztextarea").value
    okarr=okarr.replace(/ /g,"");
    okarr=okarr.split("\n");
    let result=[];
    for(let i in okarr){
        if(okarr[i]!="")result.push(okarr[i]);
    }
    if(result){
        if(confirm('共'+result.length+'组数据，是否删除？')){
            loading('删除中');
            calls({
                name,
                data:{
                    result
                },
                success(e) {
                    alert('成功删除'+e.num+'组');
                    window.location.href="./admm";
                }
            })
        }
    }
    else{
        alert('数据有问题，请在大的输入框中直接复制表格文件。以学号列表的形式复制')
    }
}
function upload(name){
    let intext="id\tscore\n"
    intext+=(document.getElementById("Ztextarea").value).trim();
    var result=tojson(intext,"0");
    result=result.slice(2,result.length-2);
    result=result.split(",\n");
    for(let n in result){
        result[n]= (new Function("return " + result[n]))();
    }
    console.log(result);
    if(result) {
        if(confirm('共'+result.length+'组数据，是否导入？')){
            loading('上传中');
            calls({
                name,
                data:{
                    score:result
                },
                success(e) {
                    closeloading();
                    alert('成功导入'+e.num+'组');
                    window.location.href="./admm";
                }
            })
        }
    }
}
function opena(name){
    calls({
        name,
        data:{},
        success(e) {
            if(e.code==2) alert('开启通道');
            else if(e.code==3) alert('关闭通道');
            else if(e.code==1){
                alert('权限不符，请重新进入');
                window.location.href="./admm";
            }
        }
    })
}
function tojson(txt,totype){
    var splitchar = /\t/;
    if (!txt.trim()) {
        alert("数据有问题，不懂联系管理员哦!");
        return false;
    }
    txt=txt.replace(/\"/g,"");
    var datas = txt.split("\n");
    var html = "[\n";
    var keys = [];
    for (var i = 0; i < datas.length; i++) {
        var ds = datas[i].split(splitchar);
        if (i == 0) {
            if (totype == "0") {
                keys = ds;
            } else {
                html += "[";
                for (var j = 0; j < ds.length; j++) {
                    html += '"' + ds[j] + '"';
                    if (j < ds.length - 1) {
                        html += ",";
                    }
                }
                html += "],\n";
            }
        }
        else {
            if (ds.length == 0) continue;
            if (ds.length == 1) {
                ds[0] == "";
                continue;
            }
            html += totype == "0" ? "{" : "[";
            for (var j = 0; j < ds.length; j++) {
                var d = ds[j];
                if (d == "") continue;
                if (totype == "0") {
                    html += '"' + keys[j] + '":"' + d + '"';
                }
                else {
                    html += '"' + d + '"';
                }
                if (j < ds.length - 1) {
                    html += ',';
                }
            }
            html += totype == "0" ? "}" : "]";
            if (i < datas.length - 1) html += ",\n";
        }
    }
    if (html&&html.lastIndexOf(",\n")==html.length-2) {
        html = html.substring(0, html.lastIndexOf(",\n"));
    }
    html += "\n]";
    return html;
}
function loading(tips) {
    document.getElementById('showload').style="";
    document.getElementById('loadtips').innerText=tips==null?'':tips;
}
function closeloading() {
    document.getElementById('showload').style="visibility: hidden";
    document.getElementById('loadtips').innerText="";
}
