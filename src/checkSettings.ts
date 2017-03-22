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
    config = vscode.workspace.getConfiguration('git-autoCommit'); 
    options = {
        cwd: `${vscode.workspace.rootPath}`
    };
    constructor() {
        this.user();
        this.checkOpenFolder();
    }

    /**
     * user
     */
    public user() {
        // 設定項目チェック - ユーザー設定には設定させない。設定されていたら、Infomation で警告する
        if (this.config.inspect<boolean>('enable').globalValue === true || this.config.inspect<boolean>('autostage').globalValue === true) {
            vscode.window.showInformationMessage('ユーザー設定に git-autoCommit 設定しないでください。確認しウインドウの再読み込みを行なってください');
            return;
        }
        // 設定項目チェック - ユーザー設定には設定させない
        if ((this.config.inspect<string>('enable').defaultValue === "false")
            && (this.config.inspect('enable').globalValue === undefined)
            && (this.config.inspect<boolean>('enable').workspaceValue === true)) {
            console.log('autocommit を動かす権利があります');
            // autoCommit();
        } else {
            return console.log('残念ながら autocommit は動かせません');
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
        vscode.window.showInformationMessage('フォルダは Git リポジトリとして構成されていません');
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

// export function checkSettings() {
//   console.log('function checkSettings');
//   const config = vscode.workspace.getConfiguration('git-autoCommit');  

//   console.log('options.cwd =', options.cwd);
  
//     checkOpenFolder();

//     // key:"git-autoCommit.enable"
//     // defaultValue:"false"
//     // workspaceValue:true
//     console.log(config.inspect<string>('enable'));

//     // Setting item check - Do not set it for user setting. If set, warn with Infomation
//     if (config.inspect<boolean>('enable').globalValue === true || config.inspect<boolean>('autostage').globalValue === true) {
//         vscode.window.showInformationMessage('ユーザー設定に git-autoCommit 設定しないでください。確認しウインドウの再読み込みを行なってください');
//         return;
//     }

//     // 設定項目チェック - ユーザー設定には設定させない
//     if ((config.inspect<string>('enable').defaultValue === "false")
//         && (config.inspect('enable').globalValue === undefined)
//         && (config.inspect<boolean>('enable').workspaceValue === true)) {
//         console.log('autocommit を動かす権利があります');
//         // autoCommit();
//     } else {
//         return console.log('残念ながら autocommit は動かせません');
//     }
// }

// export function checkOpenFolder() {
//   if (options.cwd === 'undefined'){
//     vscode.window.showInformationMessage<IdMessageItem>(
// 		'🚧 ワークスペースが開かれていません。ワークスペースを開きますか？ ', { modal: true }, 
// 			{
// 				title: 'Yes',
// 				id: 1
// 			},
// 			{
// 				title: 'No',
// 				id: 2,
//                 isCloseAffordance: true // これをつけとかないと "キャンセル" ボタンが表示されてしまう
// 			}).then((selected) => {
// 		console.log("selected =", selected);
// 		// if (!selected) {
// 		// 	console.log("case 3");
// 		// 	return;
// 		// }
// 		switch (selected.id) {
// 			case 1:
// 				console.log("case 1");
//                 vscode.commands.executeCommand('workbench.action.files.openFileFolder');
// 				break;
// 			case 2:
// 				console.log("case 2");
// 				// vscode.window.showInformationMessage('');
// 		}
// 	});
//   } else {
//     if (isGitRepo() === false) { // .git のチェックを実装
//       vscode.window.showInformationMessage('フォルダは Git リポジトリとして構成されていません');
//       return;
//     } 
//   }
//   return;
// }

// // Workspace の root に .git folder があるか？
// function isGitRepo(): boolean {
//   try {
//       fs.accessSync(path.join(options.cwd, '.git'));
//       return true;
//   } catch (error) {
//       return false;
//   }
// }




// vscode.window.showInformationMessage<MyMessageItem>(
// 		'toggle', { modal: true }, 
// 			{
// 				title: 'install',
// 				id: 1
// 			},
// 			{
// 				title: 'uninstall',
// 				id: 2,
//         isCloseAffordance: true
// 			},
// 	 ).then((selected) => {
// 		// console.log(selected);
// 		if (!selected || selected.id === 3) {
// 			// console.log("case 3");
// 			return;
// 		}
// 		switch (selected.id) {
// 			case 1:
// 				// console.log("case 1");

// 				break;
// 			case 2:
// 				// console.log("case 2");
// 					vscode.window.showInformationMessage('No Preview Tools in Preview Editor has been installed.');
// 		}
// 	});


/**
 * name
 */

