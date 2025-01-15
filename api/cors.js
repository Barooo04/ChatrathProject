const handleCors = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.NODE_ENV === 'production' 
        ? 'https://chatrathassistant.vercel.app' 
        : 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return true; // Indica che la richiesta OPTIONS è stata gestita
    }
    return false;
};

module.exports = handleCors; 