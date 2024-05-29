const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const group = new FileSync('database/student.json');
const question = new FileSync('database/question.json');

const studb = low(group);
const qesdb = low(question);

studb.defaults({
}).write();

/**
 * id:16180600524
 * ik:16180600524
 * name:李冠宇
 * objName：计算机与软件学院
 * sound：0
 * txt：
 * process: 35
 * score:0
 */
qesdb.defaults({
    righturl:'right',
    aduiourl:'',
    aduiotype:1,
    token:'',
    password:'1234567890'
}).write();

/**
 * 添加一个学生到本地数据库
 * @param stu  {id:学号,ik:密码,name:姓名,objname:系别}
 */
function AddStudent(stu) {
    try{
        let newstu={
            id:stu.id,
            ik:stu.ik,
            name:stu.name,
            objname:stu.objname,
            sound:0,
            txt:"",
            process:0,
            score:0,
            nscore:0,
            zscore:0
        }
        let d={};
        if(!studb.has(stu.id).value()){
            studb.set(stu.id, newstu).write();
        }
        else{
            studb.get(stu.id).assign(newstu).write();
        }
        return true;
    }
    catch(e){
        console.log('增加学生：',e);
        return false;
    }
}

/**
 * 从本地数据库删除一个学生
 * @type id 学号
 */
function RemoveStudent(id){
    try{
        studb.unset(id).write();
        return true;
    }
    catch(e){
        console.log('删除学生：',e);
        return false;
    }
}

/**
 * 验证学号和密码匹配
 * 如果匹配则生成token，后续所有提交均用token来做
 * @param id 学号
 * @param ik 密码
 */
function CheckPassword(id, ik){
    try{
        let pass = studb.get(id).value();
        if(pass && pass.ik==ik){
            let token = getRandomCode(18)
            studb.get(id).assign({
                token:token
            }).write();
            return {
                code:0,
                token:token
            };
        }
        else return{
            code:1
        };
    }
    catch(e){
        console.log('验证密码：',e);
        return {
            code:-1
        };
    }
}

/**
 * 验证用户token，正确即可继续进行业务
 * @param id
 * @param token
 * @returns {{bool}}
 * @constructor
 */
function CheckAuth(id,token) {
    try{
        let pass = studb.get(id).value();
        if(pass && pass.token==token)
            return true;
        else
            return false;
    }
    catch(e) {
        console.log('验证token',e);
        return false;
    }
}

function StartAudio(id) {
    studb.get(id).assign({
        sound:1
    }).write();
}

function LoadSave(id,process,file) {
    studb.get(id).assign({
        txt:file,
        process:process
    }).write();
}

function savescore(id,score) {
    let pass = studb.get(id).value();
    score=parseFloat(score);
    let nscore = parseFloat(pass.nscore);
    let zscore = parseFloat((nscore*0.7+score*0.3).toFixed(2));
    studb.get(id).assign({
        sound:2,
        score:score,
        zscore:zscore
    }).write();
}

function settype(id) {
    studb.get(id).assign({
        sound:0,
        txt:"",
        process:0,
        score:0,
        zscore:0
    }).write();
}

function upscore(id,score) {
    try{
        console.log(id,score);
        studb.get(id).assign({
            nscore:parseFloat(score)
        }).write();
        return true;
    }
    catch (e) {
        console.log('导入成绩',e);
        return false;
    }
}

function getinfo(){
    let pass=studb.value();
    let arr=[];
    for(let i in pass){
        let temp={};
        temp.id=pass[i].id;
        temp.name=pass[i].name;
        temp.objname=pass[i].objname;
        temp.process=pass[i].process;
        temp.score=pass[i].score;
        temp.nscore=pass[i].nscore;
        temp.zscore=pass[i].zscore;
        if(pass[i].sound==0)temp.state='未开始';
        else if(pass[i].sound==1)temp.state='进行中';
        else temp.state='已结束';
        arr.push(temp);
    }
    return arr;
}

/**
 * 获得用户主页加载信息
 * @param id
 * @returns {{code: number}}
 * @constructor
 */
function GetStudent(id){
    try{
        let pass = studb.get(id).value();
        let audi = qesdb.value();
        let d={};
        d.name=pass.name;
        d.objname=pass.objname;
        d.id=pass.id;
        if(audi.aduiotype==1){//音频不开放
            d.type=1;
        }
        else{//音频开放
            d.type=0;
            d.sound=pass.sound;
            if(pass.sound!=2){//未完成比赛
                d.audio=audi.aduiourl;
                d.process=pass.process;
                d.txt=pass.txt;
            }
            else{//完成比赛
                d.score=pass.score;
                d.nscore=pass.nscore;
                d.zscore=pass.zscore;
            }
        }
        d.code=0;
        return d;
    }
    catch(e){
        console.log(e);
        return {
            code:-1
        }
    }
}

/**
 * 验证管理页面token
 * @param token
 * @returns {*}
 * @constructor
 */
function InitAdmin(token){
    if(CheckadminPC(token)){
        let newtoken=getRandomCode(18);
        qesdb.set('token',newtoken).write();
        let info=GetStuinfo();
        return {
            ok:true,
            info,
            token:newtoken,
            add:'Stuinsert',
            remove:'Sturemove',
            open:'Sopen',
            seturl:'Sseturl',
            settype:'Ssettype',
            upscore:'Supscore'
        }
    }
    else{
        return {
            ok:false,
            num:getRandomNum(6)
        }
    }
}

/**
 * 移动端添加管理id
 * @param id
 * @param pass
 * @param auth
 * @returns {{code: number}}
 * @constructor
 */
function MMSAuth(id,pass,auth){
    if(CheckadminWW(pass,auth)){
        qesdb.set('token',id).write();
        return {
            code:0
        }
    }
    else{
        return {
            code:1
        }
    }
}

/**
 * 更换音频url
 * @param url
 * @constructor
 */
function MMSaudiourl(url){
    if(url!="") {
        qesdb.set('aduiourl',url).set('righturl','right').write();
    }
    else{
        qesdb.set('aduiourl',url).set('righturl','').write();
    }
}

function MMSopen() {
    if(qesdb.get('aduiotype').value()=='1'){
        qesdb.set('aduiotype','0').write();
        return true;
    }
    else{
        qesdb.set('aduiotype','1').write();
        return false;
    }
}

/**
 * 检查PC管理端是否正确
 * @param token
 * @returns {boolean}
 * @constructor
 */
function CheckadminPC(token) {
    return (token==qesdb.get('token').value());
}

/**
 * 检查移动管理端是否正确
 * @param pass
 * @param auth
 * @returns {boolean}
 * @constructor
 */
function CheckadminWW(pass,auth){
    return (qesdb.get('password').value()==pass&&auth=="6yhnbgt54rfvcde3");
}

function GetStuinfo(){
    let stus=studb.value();
    let nosize=0;
    let startsize=0;
    let endsize=0;
    let number=0
    for(let i in stus){
        number++;
        if(stus[i].sound==1)startsize++;
        if(stus[i].sound==2)endsize++;
        if(stus[i].sound==0)nosize++;
    }
    return {
        nosize,
        startsize,
        endsize,
        number
    }
}

function getRandomCode(length) {
    if (length > 0) {
        var data = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
        var nums = "";
        for (var i = 0; i < length; i++) {
            var r = parseInt(Math.random() * 61);
            nums += data[r];
        }
        return nums;
    } else {
        return false;
    }
}

function getRandomNum(length) {
    if (length > 0) {
        var data = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
        var nums = "";
        for (var i = 0; i < length; i++) {
            var r = parseInt(Math.random() * 9);
            nums += data[r];
        }
        return nums;
    } else {
        return false;
    }
}

module.exports = {
    AddStudent,
    RemoveStudent,
    CheckPassword,
    CheckAuth,
    GetStudent,
    InitAdmin,
    MMSAuth,
    CheckadminPC,
    CheckadminWW,
    MMSaudiourl,
    MMSopen,
    StartAudio,
    LoadSave,
    savescore,
    settype,
    upscore,
    getinfo
};
