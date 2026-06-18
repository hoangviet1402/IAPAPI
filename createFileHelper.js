
const fileHelper = require("../helpers/fileHelper");
const dataHelper = require("./dataHelper");
const https = require('https');
require("../globalVariable");

const fileRange = this.fileRange; // phạm vi file
const directory_forever_path = global._forever_path
const directory_main_path =global._main_path
const path_main_backup =global._path_main_backup
const directory_range = global._directory_range 

class createFileHelper{

    getCache(){
        return  console.log(data_main); 
    }

    deleteCache(){
        cache_data_id = new Map();
    }

    async getDataForeverPath(callback){
        var startTimeAll = new Date();
        this.callTelegram(this.formatDate(startTimeAll, 'dd/MM/yyyy HH:mm:sss') + " BEGIN: ====================");  
        global._is_search_short = false;
        console.log("BEGIN ====================");   
        var cache_data_id = new Map();
        var cache_data_main_device = new Map();
        var cache_data_main_new_wallet = new Map();  
        var content_check = new Map();         
        var startTime = new Date();
        var endTime = new Date();
        var file_url ="";
        var file_content =""; 
        var list_folder = [];  
        var listfile = [];
        var totalFIle = 0;
        var totalFIleHave = 0;
        var totalFIleHave_RealRun = 0;
        var rangeStart = 0;
        var rangeEnd = 0; 
        var isNodata = 0;
        try
        {
            // xoa file
            fileHelper.deleteFolder(directory_main_path + "\\id");
            fileHelper.deleteFolder(directory_main_path + "\\ip");

            //quét toàn bộ file trong thư mục MAIN device hiện  có    
            listfile = await fileHelper.readDataInPath(directory_main_path + "\\device");        
            if(listfile != undefined && listfile != null && listfile.length > 0) 
            {
                for (var i = 0; i < listfile.length; i++) {
                    await this.sleep(30);
                    file_url = directory_main_path + "\\device" + "\\" + listfile[i]
                    file_content = await fileHelper.readFile(file_url);   
                    //console.log(directory_main_path + "\\device" + "\\" + listfile[i]);   
                    cache_data_main_device.set(
                        listfile[i],
                        file_content,
                    )          
                    
                }                    
                endTime = new Date();
                listfile = [];
                fileHelper.deleteFolder(directory_main_path + "\\device");
                console.log("Device done ---- "+ (( endTime - startTime) /1000).toString());  
                startTime = new Date();
            } 
            else
            {
                isNodata++
            }       

            //quét toàn bộ file trong thư mục MAIN wallet hiện  có    
            listfile = await fileHelper.readDataInPath(directory_main_path + "\\new_wallet");     
            if(listfile != undefined && listfile != null && listfile.length > 0) 
            {     
                for (var i = 0; i < listfile.length; i++) {
                    await this.sleep(30);
                    file_url = directory_main_path + "\\new_wallet" + "\\" + listfile[i]
                    file_content = await fileHelper.readFile(file_url);   
                    cache_data_main_new_wallet.set(
                        listfile[i],
                        file_content,
                    )   
                                    
                }

                endTime = new Date();
                listfile = [];
                fileHelper.deleteFolder(directory_main_path + "\\new_wallet");       
                console.log("Wallet done ---- "+ (( endTime - startTime) /1000).toString());    
                startTime = new Date();
            }
            else
            {
                isNodata++
            }

            if(isNodata >= 2)
            {
                console.log("No file in device and new_wallet");
                this.callTelegram(this.formatDate(startTimeAll, 'dd/MM/yyyy HH:mm:sss') + '== No file in device and new_wallet');   
                return;
            }

            //quét toàn bộ file trong thư mục Id hiện  có 
            var listFolders = await fileHelper.readDataInPath(directory_forever_path);          
            for (var index = 0; index < listFolders.length; index++) {
                listfile = await fileHelper.readDataInPath(directory_forever_path + "\\"+ listFolders[index]);  
                list_folder.push(listFolders[index]);
                for (let i = 0; i < listfile.length; i++) {
                    await this.sleep(30);
                    file_url = directory_forever_path + "\\"+ listFolders[index] + "\\" + listfile[i]
                    file_content = await fileHelper.readFile(file_url);   
                    //console.log(file_url);  
                    totalFIleHave++;                        
                    cache_data_id.set(
                        listfile[i],
                        {
                            url : listFolders[index],
                            file_content : JSON.parse(file_content),
                            isUpdate: false
                        } ,
                    )
                }      
            } 
            endTime = new Date();   
            listfile = [];      
            console.log("ID done ---- "+ (( endTime - startTime) /1000).toString());
            startTime = new Date();      
            
            for (const [key, value] of cache_data_main_device)       {       
                new Map(Object.entries(JSON.parse(value))).forEach((value_item, key_item) => 
                {             
                    value_item.id.forEach(userid => 
                    {
                        totalFIle++;
                        content_check = cache_data_id.get(`${Math.floor(userid / file_range) * file_range}_to_${(Math.floor(userid / file_range) * file_range) + file_range}.json`);   
                        if(content_check != undefined && content_check != null && content_check.file_content != undefined && content_check.file_content != "{}" )
                        {     
                            
                            if(userid.toString() in content_check.file_content && content_check.file_content[userid.toString()] != undefined)
                            {    
                                content_check.file_content[userid.toString()] = [...new Set([...content_check.file_content[userid.toString()], ...value_item.id.filter(item => item.toString() !== userid.toString())])];                         
                            }                            
                            else
                            {
                                content_check.file_content[userid.toString()] = value_item.id.filter(item => item.toString() !== userid.toString());
                            }

                            cache_data_id.set(
                                `${Math.floor(userid / file_range) * file_range}_to_${(Math.floor(userid / file_range) * file_range) + file_range}.json`,
                                {
                                    url : content_check.url,
                                    file_content : content_check.file_content,
                                    isUpdate: true
                                } 
                            )
                        }
                        else
                        {
                            rangeStart = Math.floor(userid / directory_range) * directory_range;
                            rangeEnd = rangeStart + directory_range;
        
                            content_check = {};   
                            content_check[userid.toString()] = value_item.id.filter(item => item.toString() !== userid.toString());            
                            cache_data_id.set(
                                `${Math.floor(userid / file_range) * file_range}_to_${(Math.floor(userid / file_range) * file_range) + file_range}.json`,
                                {
                                    url : `${rangeStart}_to_${rangeEnd}`,
                                    file_content : content_check,
                                    isUpdate: true
                                } 
                            )
                        }                    
                    });
                });
            }

            endTime = new Date();          
            console.log("Megre device done ---- "+ (( endTime - startTime) /1000).toString());
            startTime = new Date();

            for (const [key, value] of cache_data_main_new_wallet)    
            {
                new Map(Object.entries(JSON.parse(value))).forEach((value_item, key_item) => 
                    {             
                        value_item.id.forEach(userid => 
                        {
                            totalFIle++;
                            content_check = cache_data_id.get(`${Math.floor(userid / file_range) * file_range}_to_${(Math.floor(userid / file_range) * file_range) + file_range}.json`);   
                            if(content_check != undefined && content_check != null && content_check.file_content != undefined )
                            {     
                        
                                if(userid.toString() in content_check.file_content && content_check.file_content[userid.toString()] != undefined)
                                {    
                                    content_check.file_content[userid.toString()] = [...new Set([...content_check.file_content[userid.toString()], ...value_item.id.filter(item => item.toString() !== userid.toString())])];                              
                                }                            
                                else
                                {
                                    content_check.file_content[userid.toString()] = value_item.id.filter(item => item.toString() !== userid.toString());
                                }

                                cache_data_id.set(
                                    `${Math.floor(userid / file_range) * file_range}_to_${(Math.floor(userid / file_range) * file_range) + file_range}.json`,
                                    {
                                        url : content_check.url,
                                        file_content : content_check.file_content,
                                        isUpdate: true
                                    } 
                                )
                            }
                            else
                            {
                                rangeStart = Math.floor(userid / directory_range) * directory_range;
                                content_check = {};
                                content_check[userid.toString()] = value_item.id.filter(item => item.toString() !== userid.toString()); 
                                rangeEnd = rangeStart + directory_range;                           
                                cache_data_id.set(
                                    `${Math.floor(userid / file_range) * file_range}_to_${(Math.floor(userid / file_range) * file_range) + file_range}.json`,
                                    {
                                        url : `${rangeStart}_to_${rangeEnd}`,
                                        file_content : content_check,
                                        isUpdate: true
                                    } 
                                )
                            }
                        });
                    });
            }

            endTime = new Date();
            console.log("Megre wallet done ---- "+ (( endTime - startTime) /1000).toString());          
            startTime = new Date();
        
            list_folder = null;
            var file_content_temp = ""
            for (const [key, value] of cache_data_id) {
                
                if(value.isUpdate == true)
                {
                    totalFIleHave_RealRun++
                    await this.sleep(30);
                    file_content_temp = JSON.stringify(value.file_content);
                    fileHelper.createFileSimple(directory_forever_path + "\\" + value.url + "\\" + key, file_content_temp);  
                }
                cache_data_id.delete(key);
            } 

            endTime = new Date();  
            cache_data_id.clear();      
            cache_data_id = null; 
            console.log("Update all file ID done ---- "+ (( endTime - startTime) /1000).toString());        
            startTime = new Date();

            // copy một bản back up của Main
            
            var aaa = "\\" + this.getCurrentDateTime()
            fileHelper.createSimple(path_main_backup + aaa + "\\device");   
            for (const [key, value] of cache_data_main_device) {
                fileHelper.createFileSimple(path_main_backup + aaa+ "\\device\\" + key, value); 
            } 
            
            fileHelper.createSimple(path_main_backup + aaa+ "\\new_wallet");   
            for (const [key, value] of cache_data_main_new_wallet) {
                fileHelper.createFileSimple(path_main_backup + aaa+ "\\new_wallet\\" + key, value); 
            } 
            
            endTime = new Date();          
            console.log("BACKUP all file MAIN done ---- "+ (( endTime - startTime) /1000).toString());
            console.log("done totalFIleHave: " + totalFIleHave.toString()); 
            console.log("done totalFIleHave_RealRun: " + totalFIleHave_RealRun.toString()); 
            console.log("done totalFIleRun: "  + totalFIle.toString());           
            console.log("All Time Run ---- "+ (( endTime - startTimeAll) /1000).toString());
            this.callTelegram("END: " + this.formatDate(startTimeAll, 'dd/MM/yyyy HH:mm:sss') + "All Time Run ---- "+ (( endTime - startTimeAll) /1000).toString());
        // clear data để giải phóng ram
        } catch (err) {
            console.log("ERR err:", err);
            this.callTelegram("ERR ERR ERR");
        }
        cache_data_main_new_wallet = null;
        cache_data_main_device = null;
        content_check = null;
        startTimeAll = null;
        startTime = null;
        endTime = null;
        file_url =null;
        file_content =null; 
        totalFIle = null;
        totalFIleHave = null;
        rangeStart = null;
        rangeEnd =null;   
        listfile = null;
        await this.sleep(1000);
        dataHelper.clearCache();   
        aaa= "";
        global._is_search_short = true;
        return;
    } 

    readAllFilesId( listFolders){
        console.log("readAllFilesId");  
        listFolders.forEach(filename => {
            chunks.push(global.forever_path_backup + "\\"+ filename);
        });  
            
    }

    async sleep(ms) {   
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    getCurrentDateTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
    
        // Ghép chuỗi theo định dạng YYYY-MM-DD HH:mm:ss
        return `${year}${month}${day}${hours}${minutes}${seconds}`;
    }

    formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    }

    callTelegram(message) {   
            return;      
          const req = https.request('https://api.telegram.org/bot7218349359:AAHlPQ0bw5b7LAHHvLnegCdJXnAdwIgW1jE/sendMessage?chat_id=1030951488&text='+ message, (res) => {
          });
          
          // Xử lý lỗi nếu có
          req.on('error', (error) => {
            console.error(`error callTelegram: ${error.message}`);
          });
          
          // Kết thúc yêu cầu mà không gửi thêm dữ liệu
          req.end();
    }

}

module.exports = new createFileHelper();