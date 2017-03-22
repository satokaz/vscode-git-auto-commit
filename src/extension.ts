'use strict';

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as cp from 'child_process';
import { AutoCommit } from './gitAutoCommitProvider'
import { CheckStatus } from './gitStatusCheckProvider';
import { CheckSettings } from './checkSettings'

const options = {
    cwd: `${vscode.workspace.rootPath}`
};


export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "vscode-git-auto-commit" is now active!');

    const config = vscode.workspace.getConfiguration('git-autoCommit');

let msg = cp.execSync('git status', options);
console.log(String(msg).split('\n'));

    new CheckSettings();

    if (options.cwd !== 'undefined') {
        let check = new CheckStatus();
        new AutoCommit();
    
        // let ac = new AutoCommit();
        // ac;

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





    // 設定項目チェック - ユーザー設定には設定させない。設定されていたら、Infomation で警告する　
    // if (config.inspect<boolean>('enable').globalValue === true || config.inspect<boolean>('autostage').globalValue === true) {
    //     vscode.window.showInformationMessage('ユーザー設定に git-autoCommit 設定しないでください。確認しウインドウの再読み込みを行なってください');
    //     return;
    // }

    // 設定項目チェック - ユーザー設定には設定させない
    // if ((config.inspect<string>('enable').defaultValue === "false")
    //     && (config.inspect('enable').globalValue === undefined)
    //     && (config.inspect<boolean>('enable').workspaceValue === true)) {
    //     console.log('autocommit を動かす権利があります');
    //     // autoCommit();
    // } else {
    //     return console.log('残念ながら autocommit は動かせません');
    // }