#Oppgave 3

git init
git commit -m "first commit"
git remote add origin https://github.com/geireil/testy.git
git push -u origin master
git checkout -b dev
touch hiof.js
git add .
git commit -m "commit"
git push --set-upstream origin dev
git fetch
git pull
git checkout -
git merge dev

