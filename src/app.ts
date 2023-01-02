import initMysql from "./utils/mysql"
import initMongoDB from "./utils/mongodb"

const initDB = async () => {
  return Promise.all([initMysql(), initMongoDB()]);
};

initDB()
  .then(() => {
    import("./server");
  })
  .catch((err) => {
    console.error(err);
  });
