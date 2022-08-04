const adminCheq = (user) => {
    let admin = user.admin;
    if (admin === true) {
        return true;        
    } else {
        return false;
    }
}

module.exports = {adminCheq}