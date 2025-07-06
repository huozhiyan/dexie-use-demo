import Dexie, { type EntityTable } from "dexie";

// 定义 Friend 接口，表示朋友对象的数据结构
interface Friend {
  id: number; // 朋友的唯一标识
  name: string; // 朋友的姓名
  age: number; // 朋友的年龄
}

// 创建 Dexie 数据库实例，并声明 friends 表
const db = new Dexie("FriendsDatabase") as Dexie & {
  friends: EntityTable<Friend, "id">; // friends 表，主键为 id
};

// 定义数据库的版本和表结构
db.version(1).stores({
  friends: "++id, name, age", // friends 表，id 为自增主键，包含 name 和 age 字段
});

// 导出 Friend 类型和 db 实例，供其他模块使用
export type { Friend };
export { db }; // 导出 db 实例
