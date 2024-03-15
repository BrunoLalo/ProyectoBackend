
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



export function isAdmin(name, pass) {
    return name === "adminCoder" && pass === 'admin111'
}
