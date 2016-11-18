export class Scheduler {

    taskArray: any = {};

    constructor() {
        console.log("running constructor");
        if(!Memory['scheduledTasks']){
            Memory['scheduledTasks'] = {};
        }
    }

    tick(): void {
        let currentTick = Game.time;
        let self = this;
        _.forEach(Memory['scheduledTasks'], function(task: any){
            if (currentTick % task.interval === 0) {
                console.log(`Running: ${task.name}`);
                self.taskArray[task.name].run();
            }
        });
    }

    schedule(task: Task): void {
        console.log(`scheduling ${task.name} every ${task.interval} ticks`);
        Memory['scheduledTasks'][task.name] = {
            name: task.name,
            interval: task.interval
        }
        this.taskArray[task.name] = task;
    }

    unschedule(key: string): void {
        delete Memory['scheduledTasks'][key]
    }

};
