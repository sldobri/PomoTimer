import { commands } from 'vscode';
import { Commands } from '../types/command-defs';
import { TimerComponent } from '../timer-component';

export const resumeTimerCommand = (timerComponent: TimerComponent) => {
    return commands.registerCommand(Commands.ResumeTimer, () => {
        timerComponent.resumeTimer();
    });
};
