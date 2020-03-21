const fs = require('fs');
const path = require('path');

const data = path.join(__dirname, '/data');

const writeAsync = (file, contents) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, contents, (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        })
    })
}

const main = async () => {
    for (let i = 0; i < 10; i++) {
        const file = path.join(data, `${i}.txt`);
        await writeAsync(file, `hello world ${i}`);
    }
}

main()
    .then(() => console.log('created files successfully'))
    .then(setInterval(() => console.log('running....'), 30000))
    .catch(() => console.log('failed to create files'));
