'use strict';

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as cp from 'child_process';
import { AutoCommit } from './gitAutoCommitProvider'
import { CheckStatus } from './gitStatusCheckProvider';
import { CheckSettings } from './gitCheckSettings'

const options = {
    cwd: `${vscode.workspace.rootPath}`
};

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "vscode-git-auto-commit" is now active!');
    const config = vscode.workspace.getConfiguration('git-autoCommit');

    // let msg = cp.execSync('git status', options);
    // console.log(String(msg).split('\n'));


    if (options.cwd !== 'undefined') {
        let cks = new CheckSettings();
        let check = new CheckStatus();
    
        if(cks.userSetting()){
            new AutoCommit();
        };

        let outputChannel = vscode.window.createOutputChannel('Git auto commit');
        outputChannel.show(true);

        function output() {
                outputChannel.appendLine(`\n[${(new Date().toLocaleTimeString())} - Start]`);
                outputChannel.append(check.gitStatus());
                outputChannel.appendLine(`[${(new Date().toLocaleTimeString())} - End]`);

                outputChannel.appendLine(`\n[${(new Date().toLocaleTimeString())} - Start]`);
                outputChannel.append(check.parse_status());
                outputChannel.appendLine(`[${(new Date().toLocaleTimeString())} - End]`);
                setTimeout(() => {output()}, 15000);
        }
        output();
    }

    let disposable = vscode.commands.registerCommand('extension.gitAutoCommit', () => {
        // autoCommit();
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
}
