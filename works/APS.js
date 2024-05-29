function levenshtein(str1,str2) {
    let len1 = str1.length;
    let len2 = str2.length;
    let dif = [];

    for (let a = 0; a <= len1; a++) {
        dif[a] = [];
        dif[a][0] = a;
    }
    for (let a = 0; a <= len2; a++) {
        dif[0][a] = a;
    }
    let temp;
    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            if (str1[i - 1] == str2[j - 1]) {
                temp = 0;
            } else {
                temp = 1;
            }
            dif[i][j] = min([
                dif[i - 1][j - 1] + temp,
                dif[i][j - 1] + 1,
                dif[i - 1][j] + 1
            ]);
        }
    }
    var similarity = 1 - dif[len1][len2] / Math.max(str1.length, str2.length);
    return similarity;
}

function min(ints) {
    var min = ints[0];
    for (var i = 1; i < ints.length; i++) {
        if (min > ints[i]) {
            min = ints[i];
        }
    }
    return min;
}

function clean(str) {
    try {
        return str.match(/[\u4e00-\u9fa5]/g).join("");
    }
    catch (e) {
        return "";
    }
}

function score(str1,str2){
    let sco=levenshtein(clean(str1),clean(str2));
    return (sco*100).toFixed(2);
}

module.exports={
    score
}
