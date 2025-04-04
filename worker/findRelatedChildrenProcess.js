const dataHelper = require("../helpers/dataHelper");
const logger = require("../helpers/logger");
const TreeNode = require("../models/treeNode");
// Tạo một Map để lưu trữ cache
process.on("message", async (data) => {
  try {
    const {
      file_id_path,
      file_ip_path,
      file_device_path,
      file_pass_path,
      file_newWallet_path,
      file_tranferGold_path,
      parentID,
    } = data;
    // Tạo một key để làm cache
    // Tạo một key để làm cache, thay thế dấu chấm (.) bằng chuỗi rỗng
    logger.info(`file_id_path : ${file_id_path}`);
    const [
      data_id,
      data_ip,
      data_device,
      data_pass,
      data_newWallet,
      data_tranferGold,
    ] = await Promise.all([
      dataHelper.readLargeJSONFile(file_id_path),
      dataHelper.readLargeJSONFile(file_ip_path),
      dataHelper.readLargeJSONFile(file_device_path),
      dataHelper.readLargeJSONFile(file_pass_path),
      dataHelper.readLargeJSONFile(file_newWallet_path),
      dataHelper.readLargeJSONFile(file_tranferGold_path),
    ]);

    let children_id = {};
    let parentChildren = data_id[parentID] ? data_id[parentID].children : [];

    for (const child of parentChildren) {
      children_id[child.id] = true;
    }

    const children_id_array = Object.keys(children_id);
    let children_id_except = [...children_id_array];
    const result = [];

    let tree_data = buildTree(data_ip);

    let nodeB;
    for (const child_id of children_id_array) {
      nodeB = tree_data.children.get(child_id);
      if (nodeB) {
        result.push(...nodeB.children);
        children_id_except = children_id_except.filter((id) => id !== child_id);
      }
    }

    tree_data = buildTree(data_device);
    for (const child_id of children_id_except) {
      nodeB = tree_data.children.get(child_id);
      if (nodeB) {
        result.push(...nodeB.children);
        children_id_except = children_id_except.filter((id) => id !== child_id);
      }
    }

    tree_data = buildTree(data_pass);
    for (const child_id of children_id_except) {
      nodeB = tree_data.children.get(child_id);
      if (nodeB) {
        result.push(...nodeB.children);
        children_id_except = children_id_except.filter((id) => id !== child_id);
      }
    }

    tree_data = buildTree(data_newWallet);
    for (const child_id of children_id_except) {
      nodeB = tree_data.children.get(child_id);
      if (nodeB) {
        result.push(...nodeB.children);
        children_id_except = children_id_except.filter((id) => id !== child_id);
      }
    }

    tree_data = buildTree(data_tranferGold);
    for (const child_id of children_id_except) {
      nodeB = tree_data.children.get(child_id);
      if (nodeB) {
        result.push(...nodeB.children);
        children_id_except = children_id_except.filter((id) => id !== child_id);
      }
    }
    const resultArray = Array.from(result).join(",");

    process.send({ result: resultArray });
  } catch (error) {
    process.send({ error: error.message });
  }finally{
    process.exit();
  }

  function buildTree(dataB) {
    const treeB = new TreeNode("rootB");
    for (const [idB, itemB] of Object.entries(dataB)) {
      const nodeB = new TreeNode(idB);
      nodeB.children = new Set(itemB.children.map((child) => child.id));
      treeB.children.set(idB, nodeB);
    }
    return treeB;
  }
});
