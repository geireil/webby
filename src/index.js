import './styles.scss';

const app = document.getElementById('app');

app.innerHTML = '<h1>Hello Webpack!</h1>';
app.innerHTML += '<button id="btn">Test</button>';

const btn = document.getElementById('btn');

btn.addEventListener('click', function () {
  app.innerHTML += '<p>SHIIIIIT</p>';
});
