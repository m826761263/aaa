const db = require('../works/LowDB');
const file = require('../works/File');
const aps = require('../works/APS');

/**
 * 登录业务执行
 * @return {{code, token}|{code}}
 */
function Login(id,ik){
    if(id && ik)
        return db.CheckPassword(id,ik);
    else
        return {
            code:1
        };
}

/**
 * 加载主页所需信息
 * @param id
 * @param token
 * @returns {{code: number}}
 * @constructor
 */
function LoadMain(id,token){
    if(id&&token){
        if(db.CheckAuth(id,token)){
            let mess = db.GetStudent(id);
            mess.txt = file.ReadFile(mess.txt);
            return mess;
        }
        else{
            return {
                code:1
            }
        }
    }
    else{
        return {
            code:1
        }
    }

}

/**
 * 加载管理页信息
 * @param token
 * @returns {{add, ok, remove, open, seturl}|{num, ok}}
 * @constructor
 */
function InitToAdm(token){
    return db.InitAdmin(token);
}

function StartAudio(id,token){
    if(id&&token) {
        if (db.CheckAuth(id, token)) {
            db.StartAudio(id);
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
    else{
        return {
            code:1
        }
    }
}

//实时存储容灾
function LoadSave(id,token,txt,process){
    if(id&&token) {
        if (db.CheckAuth(id, token)) {
            file.SaveFile(id,txt);
            db.LoadSave(id,process,id);
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
    else{
        return {
            code:1
        }
    }
}

/**
 * 移动端向PC端授权
 * @param id
 * @param pass
 * @param auth
 * @returns {{code: number}}
 * @constructor
 */
function MMSAuth(id,pass,auth){
    return db.MMSAuth(id,pass,auth);
}

//导入学生信息
function MMSinsertstu(token,data){
    if(db.CheckadminPC(token)){
        let num=0;
        for(let i=0;i<data.length;i++){
            if(db.AddStudent(data[i]))num++;
        }
        return {
            code:0,
            num
        }
    }
    else{
        return{
            code:1
        }
    }
}

//删除学生信息
function MMSremovestu(token,data){
    if(db.CheckadminPC(token)){
        let num=0;
        for(let i=0;i<data.length;i++){
            if(db.RemoveStudent(data[i]))num++;
        }
        return {
            code:0,
            num
        }
    }
    else{
        return{
            code:1
        }
    }
}

//设置音频地址和原为答案（Y）
function MMSseturl(token,url,txt){
    if(db.CheckadminPC(token)){
        let type=url.slice(url.length-3,url.length);
        let head=url.slice(0,4);
        if((type=='mp3'||type=='m4a')&&head=='http'){
            file.SaveFile('right',txt);
            db.MMSaudiourl(url);
            return {
                code:0
            }
        }
        else{
            return {
                code:2
            }
        }
    }
    else{
        return{
            code:1
        }
    }
}

//重置学号状态（Y)
function MMSsettype(token,id) {
    if(db.CheckadminPC(token)){
        db.settype(id);
        return {
            code:0
        }
    }
    else{
        return{
            code:1
        }
    }
}
function MMSsettype_M(id,pass,auth) {
    if(db.CheckadminWW(pass,auth)){
        db.settype(id);
        return {
            code:0
        }
    }
    else{
        return{
            code:1
        }
    }
}

//提交信息保存出成绩
function Score(id,token,txt,process) {
    if(id&&token) {
        if (db.CheckAuth(id, token)) {
            file.SaveFile(id,txt);
            db.LoadSave(id,process,id);
            let right = file.ReadFile('right');
            let score = aps.score(txt,right);
            db.savescore(id,score);
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
    else{
        return {
            code:1
        }
    }
}

//设置比赛通道开闭状态（Y）https://text-1255457623.cos.ap-beijing.myqcloud.com/18.mp3
function MMSopen(token){
    if(db.CheckadminPC(token)){
        if(db.MMSopen()){
            return {
                code:2
            }
        }
        else{
            return {
                code:3
            }
        }
    }
    else{
        return{
            code:1
        }
    }
}
function MMSopen_M(pass,auth){
    if(db.CheckadminWW(pass,auth)){
        if(db.MMSopen()){
            return {
                code:2
            }
        }
        else{
            return {
                code:3
            }
        }
    }
    else{
        return{
            code:1
        }
    }
}

//导入中文录入成绩
function MMSupscore(token,score){
    if(db.CheckadminPC(token)){
        let num=0;
        for(let i=0;i<score.length;i++){
            if(db.upscore(score[i].id,score[i].score))num++;
        }
        return {
            code:0,
            num
        }
    }
    else{
        return{
            code:1
        }
    }
}
//导出成绩排名
function MMSinfook(token){
    if(db.CheckadminPC(token)){
        let data=db.getinfo()
        return {
            data
        }
    }
    else{
        return{
            code:1
        }
    }
}


module.exports = {
    Login,
    LoadMain,
    InitToAdm,
    MMSAuth,
    MMSinsertstu,
    MMSremovestu,
    MMSseturl,
    MMSopen,
    MMSopen_M,
    StartAudio,
    LoadSave,
    Score,
    MMSsettype,
    MMSsettype_M,
    MMSupscore,
    MMSinfook
};
