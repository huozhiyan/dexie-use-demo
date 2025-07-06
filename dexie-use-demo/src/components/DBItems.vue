<template>
  <fieldset>
    <legend>DB Items</legend>
    <!-- 输入朋友姓名 -->
    <label>
      Name:
      <input v-model="friendName" type="text" />
    </label>
    <br />
    <!-- 输入朋友年龄 -->
    <label>
      Age:
      <input v-model="friendAge" type="number" />
    </label>
    <br />
    <!-- 显示当前操作状态 -->
    <p v-if="status">当前状态：{{ status }}</p>
    <!-- 操作按钮 -->
    <button @click="addFriend">Add Friend</button>
    <button @click="updateFriend">Update Friend Age By Name</button>
    <button @click="deleteFriend">Delete Friend By Name</button>
    <button @click="getFriend">Get Friend By Name</button>
    <button @click="getAllFriends">Get All Friends</button>
    <button @click="clearAllFriends">Clear All Friends</button>
    <!-- 展示朋友列表 -->
    <ul>
      <li
        v-for="(item, index) in friends"
        style="
          list-style-type: none;
          display: flex;
          justify-content: space-between;
        "
        :key="item.id"
      >
        <span>Name: {{ item.name }}</span>
        <span>Age: {{ item.age }}</span>
      </li>
    </ul>
  </fieldset>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { db, Friend } from "../db";

// 响应式变量
const status = ref("");
const friendName = ref("前端杂货铺");
const friendAge = ref(24);
const friends = ref<Friend[]>([]);

// 添加朋友
async function addFriend(): Promise<void> {
  try {
    const id = await db.friends.add({
      name: friendName.value,
      age: friendAge.value,
    });
    status.value = `Friend ${friendName.value} successfully added. Got id ${id}`;
    // 重置输入
    friendName.value = "前端杂货铺";
    friendAge.value = 24;
  } catch (error: unknown) {
    status.value = `Failed to add ${friendName.value}: ${
      error instanceof Error ? error.message : error
    }`;
  }
}

// 更新朋友信息
async function updateFriend(): Promise<void> {
  try {
    const count = await db.friends
      .where("name")
      .equals(friendName.value)
      .modify({ age: friendAge.value });
    status.value = count
      ? `Friend ${friendName.value} successfully updated.`
      : `No friend found with name ${friendName.value}.`;
  } catch (error: unknown) {
    status.value = `Failed to update ${friendName.value}: ${
      error instanceof Error ? error.message : error
    }`;
  }
}

// 删除朋友
async function deleteFriend(): Promise<void> {
  try {
    const count = await db.friends
      .where("name")
      .equals(friendName.value)
      .delete();
    status.value =
      count > 0
        ? `Friend ${friendName.value} successfully deleted.`
        : `No friend found with name ${friendName.value}.`;
  } catch (error: unknown) {
    status.value = `Failed to delete ${friendName.value}: ${
      error instanceof Error ? error.message : error
    }`;
  }
}

// 查询单个朋友
async function getFriend(): Promise<void> {
  try {
    const friend = await db.friends
      .where("name")
      .equals(friendName.value)
      .first();
    if (friend) {
      friends.value = [friend];
      status.value = `Found friend: ${friend.name}, Age: ${friend.age}`;
    } else {
      friends.value = [];
      status.value = `No friend found with name ${friendName.value}.`;
    }
  } catch (error: unknown) {
    status.value = `Failed to retrieve friend: ${
      error instanceof Error ? error.message : error
    }`;
  }
}

// 查询所有朋友
async function getAllFriends(): Promise<void> {
  try {
    friends.value = await db.friends.toArray();
    status.value = `Found ${friends.value.length} friends.`;
  } catch (error: unknown) {
    status.value = `Failed to retrieve friends: ${
      error instanceof Error ? error.message : error
    }`;
  }
}

// 清空所有朋友
async function clearAllFriends(): Promise<void> {
  try {
    await db.friends.clear();
    friends.value = [];
    status.value = "All friends cleared.";
  } catch (error: unknown) {
    status.value = `Failed to clear friends: ${
      error instanceof Error ? error.message : error
    }`;
  }
}
</script>

<style scoped>
button {
  margin: 5px;
  padding: 5px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}
</style>
