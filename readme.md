1. Чтобы создать package.json, нужно запустить команду: sudo npm init --yes
2. Если мы на маке, то нужно выдать прав для редактирования файла package.json
3. Нужно поставить все пакеты из package.json (sudo npm i --save-dev gulp)
4. Добавить в файл package.json в scripts строчку "start": "gulp dev".
5. Запустить сборку можно командой sudo npm start

Что делает эта сборка:
1. Собирает css (autoprefixer, sourcemaps)
2. Собирает pug (в том числе data.json)
3. Копирует файлы js
4. Перед запуском очищает папку build (нужно следить, чтобы эта папка всегда 
   была)