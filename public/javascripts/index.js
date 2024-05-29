function logincall(){
    let id=getvalue('name')
    calls({
        name:'login',
        data:{
            id:id,
            ik:getvalue('pass')
        },
        success(e){
            console.log(e);
            if(e.code==0){
                window.location.href="./";
            }
            else{
                alert('用户名或密码错误，请确认后重新尝试！')
            }
        }
    })
}


