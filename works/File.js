var fs = require('fs');

function SaveFile(id,text){
    return fs.writeFileSync('./public/files/'+id+'.txt',text);
}

function ReadFile(id) {
    try{
        return fs.readFileSync('./public/files/'+id+'.txt','utf-8');
    }
    catch(e){
        return "";
    }
}

module.exports={
    SaveFile,
    ReadFile
}
