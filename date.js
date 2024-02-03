//jshinit esversion:6

exports.getDate = function(){
    let options = { 
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    };
    let today = new Date();
    
    return today.toLocaleDateString("en-US",options);
}


exports.getTime = function(){
    let options = { 
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    };
    let today = new Date();
    
    return today.toLocaleTimeString("en-US",options);
}