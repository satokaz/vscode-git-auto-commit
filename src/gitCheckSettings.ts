'use strict';

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

const options = {
    cwd: `${vscode.workspace.rootPath}`
};

interface IdMessageItem extends vscode.MessageItem {
    id: number;
}

export class CheckSettings {
    private config = vscode.workspace.getConfiguration('git-autoCommit'); 
    private options = {
        cwd: `${vscode.workspace.rootPath}`
    };
    constructor() {
        this.userSetting();
        this.checkOpenFolder();
    }

    /**
     * user
     */
    public userSetting() {
        // Setting item check - Do not set it for user setting. If set, warn with Infomation.
        if (this.config.inspect<boolean>('enable').globalValue === true || this.config.inspect<boolean>('autostage').globalValue === true) {
            vscode.window.showInformationMessage('ユーザー設定に git-autoCommit 設定しないでください。確認しウインドウの再読み込みを行なってください');
            return false;
        }
        // Setting item check - Do not set it for user setting.
        if ((this.config.inspect<string>('enable').defaultValue === "false")
            && (this.config.inspect<boolean>('enable').globalValue === undefined)
            && (this.config.inspect<boolean>('enable').workspaceValue === true)) {
            console.log('autocommit を動かすことができます');
            return true;
        } else {
            console.log('残念ながら autocommit は動かせません');
            return false;
        }
    }

    public checkOpenFolder() {
        if (options.cwd === 'undefined'){
            vscode.window.showInformationMessage<IdMessageItem>(
                '🚧 ワークスペースが開かれていません。ワークスペースを開きますか？ ', { modal: true }, 
                    {
                        title: 'Yes',
                        id: 1
                    },
                    {
                        title: 'No',
                        id: 2,
                        isCloseAffordance: true // これをつけとかないと "キャンセル" ボタンが表示されてしまう
                    }).then((selected) => {
                console.log("selected =", selected);
                // if (!selected) {
                // 	console.log("case 3");
                // 	return;
                // }
                switch (selected.id) {
                    case 1:
                        console.log("case 1");
                        vscode.commands.executeCommand('workbench.action.files.openFileFolder');
                        break;
                    case 2:
                        console.log("case 2");
                        // vscode.window.showInformationMessage('');
                }
            });
        } else {
            if (this.isGitRepo() === false) { // .git のチェックを実装
                vscode.window.showInformationMessage('This workspace is not configured as a Git repository.');
                return;
            } 
        }
    return;
    }

    public isGitRepo(): boolean {
        try {
            fs.accessSync(path.join(options.cwd, '.git'));
            return true;
        } catch (error) {
            return false;
        }
    }
}
