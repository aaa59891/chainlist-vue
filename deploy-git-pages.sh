npm run build
rsync ./dist/* ./docs
rsync ./prod/index.html ./docs
git add .
git commit -m 'deploy to github pages'
git push