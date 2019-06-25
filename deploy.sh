docker login registry.gitlab.com -u danphi

rm -rf build && mkdir build
./node_modules/.bin/babel -d ./build . --ignore node_modules
cp package.json build
cp package-lock.json build

docker build -t registry.gitlab.com/danphi/trademymoney .
docker push registry.gitlab.com/danphi/trademymoney
