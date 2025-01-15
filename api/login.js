const connection = require('./db');
const handleCors = require('./cors');

module.exports = async (req, res) => {
    // Gestione CORS
    if (handleCors(req, res)) return;

    // Verifica del metodo HTTP
    if (req.method !== 'POST') {
        res.status(405).json({ message: 'Metodo non consentito' });
        return;
    }

    const { email, password } = req.body;

    // Query al database
    connection.query(
        'SELECT * FROM user WHERE email = ? AND password = ?',
        [email, password],
        (err, results) => {
            if (err) {
                console.error('Errore interno del server:', err);
                res.status(500).json({ message: 'Errore interno del server' });
                return;
            }
            if (results.length > 0) {
                const user = results[0];
                res.status(200).json({ 
                    message: 'Login effettuato con successo!', 
                    user: { id: user.id, name: user.name } 
                });
            } else {
                res.status(401).json({ message: 'Email o password errati' });
            }
        }
    );
}; 