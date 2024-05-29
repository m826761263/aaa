var cha=0;

function preaudio() {
    document.getElementById('boxbtn').removeAttribute('disabled');
    document.getElementById('boxbtn').innerText='播放音频';
}

function boxok() {
    calls({
        name:'startaudio',
        data:{},
        success(e){
            console.log(e);
            if(e.code==0){
                document.getElementById("sound").currentTime=process;
                document.getElementById("sound").play();
                document.getElementById("boxbtn").disabled = "disabled";
                document.getElementById("boxbtn").innerText='播放中';
                cha=parseFloat(process);
            }
            else{
                alert('播放请求拒绝，如果正在比赛中，请联系比赛负责人')
            }
        }
    })
}

function timeload() {
    let current=document.getElementById("sound").currentTime;
    let a = (((current/ document.getElementById("sound").duration).toFixed(4) * 100).toFixed(2));
    document.getElementById("bar").value = a;
    document.getElementById("process").innerText = a + "%";
    if(current-15>=cha){
        cha=current;
        let text=document.getElementById("content").value;
        if(!window.localStorage){
            UserData.setItem('editor-text',text);
        }else{
            localStorage.setItem('editor-text',text);
        }
        calls({
            name:'loadsave',
            data:{
                txt:text,
                process:current
            },
            success(e){
                if(e.code==0){
                    Showlog('已同步至云端')
                }
                else{
                    ShowWarn('同步云端出错')
                }
            }
        })
    }
}
function submit() {
    let text=document.getElementById("content").value;
    let current=document.getElementById("sound").currentTime;
    if(!current){
        current=process
    }
    console.log(current);
    if(confirm('是否提交，提交后不能够重新提交！')){
        loading('提交中')
        calls({
            name:'submitscore',
            data:{
                txt:text,
                process:current
            },
            success(e){
                if(e.code==0){
                    window.location.href="./";
                }
                else{
                    alert('提交出错，权限消失，请复制保存好你的文字，然后联系比赛方')
                }
            }
        })
    }
}

function Adsize(e) {
    console.log("++");
    let m = document.getElementById("content");
    let count = getComputedStyle(m).fontSize
    console.log(getComputedStyle(m).fontSize);
    let size = parseInt(count) + 2;
    m.style.fontSize = size + "px";
}

function Desize() {
    console.log("--");
    let m = document.getElementById("content");
    let count = getComputedStyle(m).fontSize
    console.log(getComputedStyle(m).fontSize);
    let size = parseInt(count) - 2;
    m.style.fontSize = size + "px";
}

function Showlog(txt){
    let mess=document.getElementById("messshow")
    mess.innerText=txt;
    mess.style="background-color: rgb(42, 204, 43);"
    setTimeout(function () {
        mess.innerText="";
        mess.style=""
    },1000)
}

function ShowWarn(txt) {
    let mess=document.getElementById("messshow")
    mess.innerText=txt;
    mess.style="background-color: red"
    setTimeout(function () {
        mess.innerText="";
        mess.style=""
    },3000)
}

function loading(tips) {
    document.getElementById('showload').style="";
    document.getElementById('loadtips').innerText=tips==null?'':tips;
}
function closeloading() {
    document.getElementById('showload').style="visibility: hidden";
    document.getElementById('loadtips').innerText="";
}
