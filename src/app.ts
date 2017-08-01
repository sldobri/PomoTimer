import { workspace, commands, ExtensionContext } from 'vscode';
import { TimerComponent } from "./timer-component";
import { TaskComponent } from "./task-component";
import { MessagingCenter } from "./messaging-center";
import { Commands } from './types/commands';
import { Messages } from './types/messages';

export const createApp = (context: ExtensionContext) => {
    const config = workspace.getConfiguration('pomotimer')
    let configMinutes = config.get<number>('workTime') || 20;
    let timerComponent = new TimerComponent(configMinutes, Commands.StartTimer, Commands.RestartTimer);
    let taskComponent = new TaskComponent(context.globalState);

    MessagingCenter.subscribe(Messages.AttachTask, (selectedTask: string) => {
        timerComponent.setWorkingTask(Commands.DisplayTaskboard, selectedTask);
    });

    const displayTimerCommand = commands.registerCommand(Commands.DisplayTimer, async () => {
        timerComponent.displayTimer();
    });

    const startTimerCommand = commands.registerCommand(Commands.StartTimer, async () => {
        if (!timerComponent.selectedTask) {
            await taskComponent.showTaskboard();
        } else {
            timerComponent.startTimer(Commands.PauseTimer);
        }
    });

    const pauseTimerCommand = commands.registerCommand(Commands.PauseTimer, () => {
        timerComponent.pauseTimer(Commands.ResumeTimer);
    });

    const resumeTimerCommand = commands.registerCommand(Commands.ResumeTimer, () => {
        timerComponent.resumeTimer(Commands.PauseTimer);
    });

    const restartTimerCommand = commands.registerCommand(Commands.RestartTimer, () => {
        timerComponent.restartTimer(Commands.StartTimer, Commands.RestartTimer);
    });

    const hideTimerCommand = commands.registerCommand(Commands.HideTimer, () => {
        timerComponent.hideTimer();
    });

    const displayTaskboardCommand = commands.registerCommand(Commands.DisplayTaskboard, async () => {
        await taskComponent.showTaskboard();
    });

    context.subscriptions.push(displayTaskboardCommand, displayTimerCommand,
        startTimerCommand, pauseTimerCommand, resumeTimerCommand,
        restartTimerCommand, hideTimerCommand);
};
