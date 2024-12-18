zola build

cd public

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:chmlee/ream-doc.git master:gh-pages

cd -
