
export function notAuth(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.redirect('/login')
    }
    next();
}



export function admin(req, res, next) {
    if (!req.session.user) {
        return res.status(403).json({ status: 'error', message: 'Acceso no autorizado' });
    }
    next();
}


export function soloRoles(roles = []) {
    return function (req, res, next) {
        if (!req.session.user || !roles.includes(req.session.user.role)) {
            return res.status(403).json({ status: 'error', message: 'Acceso no autorizado' });
        }
        next();
    };
}


export function isAdmin (req, res, next) {
    if (req.isAuthenticated() && req.usuario.role === 'admin') {
        console.log(req.usuario.role)
        return next();
    }
    res.status(403).send('Acceso no autorizado');
};

export function isPremium(req, res, next) {
    if (req.isAuthenticated() && req.usuario.role === 'premium') {
        return next();
    }
    res.status(403).send('Acceso no autorizado');
};