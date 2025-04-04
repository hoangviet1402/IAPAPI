const express = require("express");
const fetch = require('node-fetch');

const router = express.Router();
const dataHelper = require("../helpers/dataHelper");
const createFileHelper = require("../helpers/createFileHelper");
const logger = require("../helpers/logger");

router.get("/findeUser_all", async (req, res) => {
  try {
    let user_id = req.query.userID;
    if(user_id == undefined || user_id == null || user_id <= 0)
    {
      res.json({ Code: 0, Data: "" });
      return;
    }
    if(await dataHelper.checkIsBot(user_id)){
      res.json({ Code: 0, Data: "" });
      return;
    }
    const result = await dataHelper.findRelatedChildren(user_id);    
    if (result == -1) {
      res.json({ Code: 0, Data: "" });
    } else {
      res.json({ Code: 0, Data: result });
    }
  } catch (error) {
    res.json({ Code: 1, Data: "" });
    logger.error(`[/findeUser] ${error}`);
  }
});

router.get("/findeUser_short", async (req, res) => {
  try {
    let user_id = req.query.userID;
    if(await dataHelper.checkIsBot(user_id)){
      res.json({ Code: 0, Data: "" });
      return;
    }
    const result = await dataHelper.findRelatedChildren_short(user_id);
    if (result == -1) {
      res.json({ Code: 0, Data: "" });
    } else {
      res.json({ Code: 0, Data: result.join(",") });
    }
  } catch (error) {
    res.json({ Code: 1, Data: "" });
    logger.error(`[/findeUser] ${error}`);
  }
});

router.get("/findeUser_forever", async (req, res) => {
  try {
    let user_id = req.query.userID;
    if(await dataHelper.checkIsBot(user_id)){
      res.json({ Code: 0, Data: "" });
      return;
    }
    const result = await dataHelper.searchDataInFile(user_id);
    res.json({ Code: 0, Data: result.join(",") });
  } catch (error) {
    res.json({ Code: 1, Data: "" });
    logger.error(`[/findeUser] ${error}`);
  }
});

router.get("/findeUser_forever_optimize", async (req, res) => {
  try {
    let user_id = req.query.userID;
    if(await dataHelper.checkIsBot(user_id)){
      res.json({ Code: 0, Data: "" });
      return;
    }
    const result = await dataHelper.searchDataInFileOptimize(user_id);
    res.json({ Code: 0, Data: result.join(",") });
  } catch (error) {
    res.json({ Code: 1, Data: "" });
    logger.error(`[/findeUser] ${error}`);
  }
});

router.get("/set_relates_short_is_backup", async (req, res) => {
  try {
    const pool = await poolPromise;
    await pool
      .request()
      .execute("[Web].[dbo].[Out_set_relates_short_is_backup]");
  } catch (error) {
    logger.error(`[/set_relates_short_is_backup] ${error}`);
  }
});

router.get("/findeUser2", async (req, res) => {
  try {
    let user_id = req.query.userID;
    const result = await dataHelper.findRelatedChildren(user_id);
    if (result == -1) {
      res.json({ Code: 1 });
    } else {
      res.json({ Code: 0, Data: result });
    }
  } catch (error) {
    res.json({ Code: 1, Data: error });
    logger.error(`[/findeUser2] ${error}`);
  }
});

router.post("/clearAllCache", async (req, res) => {
  try {
    dataHelper.clearCache();
    res.send();
  } catch (error) {
    logger.error(`[/clearAllCache] ${error}`);
  }
});

router.post("/clearShortCache", async (req, res) => {
  try {
    dataHelper.clearCacheShort();
    res.send();
  } catch (error) {
    logger.error(`[/clearAllCache] ${error}`);
  }
});

router.get("/CreateFileID", async (req, res) => {
  try {   
    createFileHelper.getDataForeverPath();
    
    res.json({ Code: 0, Data: global._is_used_bk });
  } catch (error) {
    res.json({ Code: 1, Data: error });
    logger.info(`error: ${error}`);
  }
});

router.get("/CreateFileIDMutiDay", async (req, res) => {
  try {   
    createFileHelper.getDataForeverPathMutiDay();
    
    res.json({ Code: 0, Data: global._is_used_bk });
  } catch (error) {
    res.json({ Code: 1, Data: error });
    logger.info(`error: ${error}`);
  }
});

router.get("/Index", async (req, res) => {
  try {   
   
    res.json({ Code: 0, Data: 0});
  } catch (error) {
    res.json({ Code: 1, Data: error });
    logger.info(`error: ${error}`);
  }
});

router.post("/Iap", async (req, res) => {
  try {   
    const receiptData = req.body.r || '';
    let receiptData_Url = req.body.u || '';
    
    // Ensure URL is absolute
    if (!receiptData_Url.startsWith('http://') && !receiptData_Url.startsWith('https://')) {
      receiptData_Url = `https://${receiptData_Url}`;
    }

    // Function to make the verification request
    const verifyReceipt = async (url) => {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'receipt-data': receiptData
          })
        });
        return await response.text();
      } catch (error) {
        logger.error(`IAP verification error: ${error}`);
        return error.message;
      }
    };

    // Make request to the specified URL
    const productionResponse = await verifyReceipt(receiptData_Url);

    // Return response
    res.send(`${productionResponse}`);
  } catch (error) {
    res.status(500).json({ Code: 1, Data: error.message });
    logger.error(`[/Iap] ${error}`);
  }
});

// Xuất router để sử dụng ở nơi khác
module.exports = router;
