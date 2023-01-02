
import schedule from "node-schedule";
export const setSchedule = async () =>{
  schedule.scheduleJob("0/10 * * * * *", async () => {
    console.log("스케줄러 작동 : ", new Date());
  });
}