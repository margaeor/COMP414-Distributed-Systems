function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function findIpFromRequest(req) {
    var ip = (req.headers['x-forwarded-for'] || '').split(',').pop() || 
    req.connection.remoteAddress || 
    req.socket.remoteAddress || 
    req.connection.socket.remoteAddress;

    if (ip.substr(0, 7) == "::ffff:") {
        ip = ip.substr(7)
    }
    return ip;
}

module.exports = {
    shuffleArray: shuffleArray,
    findIpFromRequest: findIpFromRequest
}