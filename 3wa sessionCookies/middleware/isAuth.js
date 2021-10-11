const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
        next();
    }
    res.redirect('/login');
}

module.exports = isAuth;