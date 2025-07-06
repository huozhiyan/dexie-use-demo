// 打开名为"test"的IndexedDB数据库，返回一个IDBOpenDBRequest对象
const db = window.indexedDB.open("test");
// 用于存储数据库连接
let connection;

// 当数据库版本升级或首次创建时触发的事件
db.onupgradeneeded = (e) => {
  // 获取数据库连接
  connection = e.target.result;

  // 在数据库中创建一个名为'user'的对象存储空间(objectStore)
  // 设置'user_id'作为主键(keyPath)
  connection.createObjectStore("user", {
    keyPath: "user_id",
  });
};

// 成功时触发的事件
db.onsuccess = (e) => {
  // 获取数据库连接
  connection = e.target.result;
  console.log("connection success");
};

// 失败时触发的事件
db.onerror = (e) => {
  console.log("connection error");
};

// 模拟异步操作
setTimeout(() => {
  // 创建一个事务，指定要操作的对象存储空间为user，并设置事务模式为读写模式，允许读取和修改数据
  const tx = connection.transaction("user", "readwrite");
  // 获取到store
  const store = tx.objectStore("user");

  // add
  const addReq = store.add({
    user_id: "1",
    user_name: "前端杂货铺",
  });
  addReq.onsuccess = () => {
    console.log("add success");
  };
  addReq.onerror = () => {
    console.log("add error");
  };

  // update
  const putReq = store.put({
    user_id: "1",
    user_name: "前端杂货铺2025",
  });
  putReq.onsuccess = () => {
    console.log("update success");
  };
  putReq.onerror = () => {
    console.log("update error");
  };

  // get
  const getReq = store.get("1");
  getReq.onsuccess = (e) => {
    console.log(e.target.result);
  };
  getReq.onerror = () => {
    console.log("get error");
  };

  // delete
  const delReq = store.delete("1");
  delReq.onsuccess = () => {
    console.log("delete success");
  };
  delReq.onerror = () => {
    console.log("delete error");
  };
}, 1000);
