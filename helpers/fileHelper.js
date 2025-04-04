
const path = require("path");
const fs = require("fs");

class FileHelper {
    checkWebp(nameFile) {
        let typeFile = ["jpg", "jpeg", "png"];
        for (var item of typeFile) {
            if (nameFile.search(item) != -1) {
                return (nameFile = nameFile.slice(0, nameFile.search(item)) + "webp");
            }
        }
    }

    createFileSimple(pathFile, content) {    
        try {
            // Tạo thư mục cha nếu chưa tồn tại
            const dir = path.dirname(pathFile);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(pathFile, content);
        } catch (err) {
            console.error('createFileSimple err:', err);
        }
    }

    // async createSimple(pathFolder) {       
    //     if (await !fs.existsSync(pathFolder)) {
    //         await fs.mkdirSync(pathFolder, {
    //             recursive: true,
    //         });
    //     }
    // }
    
    createSimple(pathFolder) {
        try {
            fs.mkdirSync(pathFolder, {
                recursive: true, // Tạo thư mục cha nếu chưa tồn tại
            });
        } catch (err) {
            console.error('createSimple not found:' + pathFolder);
        }
    }

    checkFolderExists(pathFolder) {
        try {
            fs.accessSync(pathFolder); // Nếu thư mục tồn tại, không có lỗi
            return true;
        } catch (err) {
            return false;
        }
    }

    createFolder(dirname, TypeFolder) {
        const datetime = new Date();
        const Year = datetime.getFullYear();
        const Month = (datetime.getMonth() + 1).toString().padStart(2, "0");
        const Day = datetime.getDate().toString().padStart(2, "0");
        const rs = `${TypeFolder}\\${Year}\\${Month}\\${Day}`;
        const pathFolder = `${dirname}\\${TypeFolder}\\${Year}\\${Month}\\${Day}`;
        if (!fs.existsSync(pathFolder)) {
            fs.mkdirSync(pathFolder, {
                recursive: true,
            });
        }
        return {
            pathFolder: pathFolder,
            rs: rs,
        };
    }

    base64_encode(file) {
        // read binary data
        var bitmap = fs.readFileSync(file);
        // convert binary data to base64 encoded string
        return new Buffer(bitmap).toString("base64");
    }

    async  readDataInPath(dirname) {
        try
        { 
            const data = await fs.readdirSync(
                dirname
            );            
            return data.filter(item => item.includes('.rar') == false);
        }
        catch (error) {
            console.error('readDataInPath not found:' + dirname);
            return [];
        }
    }

    async readFile(dirname) {
        if(dirname.includes('.rar') == false)
        {
            const data = await fs.readFileSync(dirname, "utf-8");
            return data;
        }
        else
        {
            return '';
        }
    }

    async readFiles(dirname, onFileContent, onError) {
        fs.readdir(dirname, function (err, filenames) {
            if (err) {
                onError(err);
                return;
            }
            filenames.forEach(function (filename) {
                fs.readFile(dirname + "\\" + filename, "utf-8", function (err, content) {
                    if (err) {
                        onError(err);
                        return;
                    }
                    onFileContent(filename, content);
                });
            });
        });
    }

    async deleteFolder(nameFolder) {
        try {
            fs.rm(
                nameFolder,
                {
                    recursive: true,  // Xóa thư mục đệ quy
                    force: true,      // Ép xóa ngay cả khi không có quyền
                },
                (err) => {
                    if (err) {
                        console.log("deleteFolder err:", err);
                        return;  // Kết thúc hàm nếu có lỗi
                    }
                }
            );
        } catch (err) {
            console.error('deleteFolder not found:' + nameFolder);
        }
    }

    async deleteFile(nameFile, folderPath) {
        try {
            // Find all files in the folder
            const files = await fsPromises.readdir(folderPath);
            await fsPromises.unlink(path.resolve(folderPath, nameFile));
            //console.log(`${nameFile} has been removed successfully \n`)
        } catch (err) {
            //console.log(`${nameFile} has been removed faile \n`)
        }
    }

    async createZipArchive(name, input) {
        console.log("Creating zip archive");
    }

    createName() {
        let today = Date.now();
        let uniqueSuffix = new Date().getMilliseconds();
        let createName = `r-${today}-${uniqueSuffix}`;
        console.log("createName: ", createName);
        return createName;
    }

    // Hàm kiểm tra nếu tệp được tạo hoặc chỉnh sửa hôm nay
    isToday(date) {
        const today = new Date();
        return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
    }

    // Hàm lưu ngày hiện tại vào tệp .lastRun
    saveLastRunDate(filePath) {
        const today = new Date().toISOString();
        fs.writeFileSync(filePath, today, "utf8");
    }

    // Hàm kiểm tra nếu hàm đã chạy hôm nay
    hasRunToday(filePath) {
        if (!fs.existsSync(filePath)) return false;
        const lastRunDate = new Date(fs.readFileSync(filePath, "utf8"));
        return this.isToday(lastRunDate);
    }

    // Hàm quét và xóa các tệp không tạo hoặc chỉnh sửa hôm nay
    cleanDirectory(directoryPath) {
        const lastRunFile = path.join(directoryPath, ".lastRun");

        // Kiểm tra nếu hàm đã chạy hôm nay
        if (this.hasRunToday(lastRunFile)) {
            return;
        }

        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                return console.log("Unable to scan directory: " + err);
            }

            files.forEach((file) => {
                const filePath = path.join(directoryPath, file);

                fs.stat(filePath, (err, stats) => {
                    if (err) {
                        console.log(`Unable to stat file: ${filePath}`);
                        return;
                    }

                    // Kiểm tra nếu tệp không được tạo hoặc chỉnh sửa hôm nay
                    if (!this.isToday(stats.birthtime) && !this.isToday(stats.mtime)) {
                        fs.unlink(filePath, (err) => {
                            if (err) {
                                console.log(`Unable to delete file: ${filePath}`);
                            } else {
                                console.log(`Deleted file: ${filePath}`);
                            }
                        });
                    }
                });
            });
        });

        // Lưu ngày hiện tại vào tệp .lastRun sau khi hoàn thành
        this.saveLastRunDate(lastRunFile);
    }
}
module.exports = new FileHelper();
