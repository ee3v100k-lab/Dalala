require('dotenv').config();
const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const path = require('path');

const { loadUser } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  store: new SQLiteStore({ db: 'sessions.sqlite', dir: path.join(__dirname, 'db') }),
  secret: process.env.SESSION_SECRET || 'dalala-dev-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 يوم
    httpOnly: true,
  },
}));

app.use(loadUser);

app.use('/', require('./routes/auth'));
app.use('/', require('./routes/ads'));
app.use('/', require('./routes/favorites'));
app.use('/', require('./routes/messages'));

// صفحة 404
app.use((req, res) => {
  res.status(404).render('404', { title: 'الصفحة غير موجودة | دلالة' });
});

app.listen(PORT, () => {
  console.log(`✅ دلالة شغّالة الآن على: http://localhost:${PORT}`);
});
