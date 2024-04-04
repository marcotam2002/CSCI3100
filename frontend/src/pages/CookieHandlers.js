/*
 * Group members:
 * Tam King Man 1155160072
 * Tsang Ho Yin 1155159307
 * Ng Yuk Fung 1155176966
 * Leung Ka Lun 1155157403
 * O Ching Lam 1155159131
 */

//create cookie for 30 days and delete cookie when unclick the checkbox
export function handleCookie(event){
    console.log(event.target.checked)
    let username = document.getElementById("usernameInput").value;
    let d = new Date();
    if (event.target.checked){
        d.setDate(d.getDate()+ 30);
        document.cookie = 'username =' + username + "; expires=" + d +"; path=/"
    }else{
        d.setDate(d.getDate() - 1);
        document.cookie = 'username =' + username + "; expires=" + d +"; path=/"
    }   
}

//read from cookie
export function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}